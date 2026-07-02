/**
 * Shared leaderboard API for the Barn Door Keeper game.
 *
 * Persistence uses a Redis REST endpoint (Vercel KV or Upstash) when the
 * usual env vars are present. If none are configured it falls back to an
 * in-memory board so the route still works in local dev / previews — that
 * fallback is per-instance and not durable, which the response flags via
 * `persistent: false`.
 *
 * To make it a real global board, connect a KV/Upstash store in Vercel;
 * the integration injects the env vars below automatically — no code change.
 */

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "barn-keeper:leaderboard";
const TOP_N = 10;
const KEEP_N = 100; // trim the stored set so it doesn't grow forever
const MAX_LEVEL = 20;

export const dynamic = "force-dynamic";

interface Entry {
  name: string;
  score: number;
  saves: number;
  level: number;
  won: boolean;
  at: number;
}

const hasRedis = () => Boolean(REDIS_URL && REDIS_TOKEN);

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

/* --- in-memory fallback (per serverless instance) --- */
const memory: Entry[] = [];
function memoryAdd(entry: Entry) {
  memory.push(entry);
  memory.sort((a, b) => b.score - a.score || b.saves - a.saves);
  memory.length = Math.min(memory.length, KEEP_N);
}
const memoryTop = () => memory.slice(0, TOP_N);

async function getTop(): Promise<Entry[]> {
  if (!hasRedis()) return memoryTop();
  const flat = (await redis(["ZRANGE", REDIS_KEY, 0, TOP_N - 1, "REV", "WITHSCORES"])) as string[];
  const entries: Entry[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    try {
      const member = JSON.parse(flat[i]) as Omit<Entry, "score">;
      entries.push({ ...member, score: Number(flat[i + 1]) });
    } catch {
      // skip malformed members
    }
  }
  return entries;
}

async function addEntry(entry: Entry): Promise<Entry[]> {
  if (!hasRedis()) {
    memoryAdd(entry);
    return memoryTop();
  }
  // member carries everything except the score (which is the sort key)
  const member = JSON.stringify({
    name: entry.name,
    saves: entry.saves,
    level: entry.level,
    won: entry.won,
    at: entry.at,
  });
  await redis(["ZADD", REDIS_KEY, entry.score, member]);
  await redis(["ZREMRANGEBYRANK", REDIS_KEY, 0, -(KEEP_N + 1)]); // keep only the top KEEP_N
  return getTop();
}

const clampInt = (v: unknown, min: number, max: number, fallback = min) => {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
};

export async function GET() {
  try {
    const entries = await getTop();
    return Response.json({ entries, persistent: hasRedis() });
  } catch {
    return Response.json({ entries: memoryTop(), persistent: false }, { status: 200 });
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const entry: Entry = {
    name: (rawName || "Anonymous").slice(0, 16),
    score: clampInt(body.score, 0, 1_000_000),
    saves: clampInt(body.saves, 0, 100_000),
    level: clampInt(body.level, 1, MAX_LEVEL, 1),
    won: Boolean(body.won),
    at: clampInt(body.at, 0, Number.MAX_SAFE_INTEGER, Date.now()),
  };

  try {
    const entries = await addEntry(entry);
    return Response.json({ entries, persistent: hasRedis() });
  } catch {
    // if the store is unreachable, still return the current in-memory view
    memoryAdd(entry);
    return Response.json({ entries: memoryTop(), persistent: false }, { status: 200 });
  }
}
