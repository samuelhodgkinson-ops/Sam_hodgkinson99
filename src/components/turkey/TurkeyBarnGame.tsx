"use client";

import { useCallback, useEffect, useReducer, useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/*  Game model                                                         */
/* ------------------------------------------------------------------ */

const NUM_DOORS = 6;
const START_POINTS = 100;
const SHUT_REWARD = 4; // base genetic improvement points per shut door
const ESCAPE_PENALTY = 12; // points lost when a turkey escapes
const TICK_MS = 100;

type Phase = "idle" | "playing" | "over";

interface Door {
  id: number;
  open: boolean;
  progress: number; // 0 → 1, how close the turkey is to escaping
  windowMs: number; // total time the door stays open before the turkey bolts
  cooldownMs: number; // time left (while closed) before the door swings open
}

interface Game {
  phase: Phase;
  points: number;
  saved: number;
  escaped: number;
  doors: Door[];
}

/* Difficulty scales with the number of turkeys you have already saved. */
const levelFor = (saved: number) => Math.floor(saved / 6) + 1;

const windowForLevel = (level: number) => Math.max(820, 2600 - (level - 1) * 130);

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const cooldownForLevel = (level: number) =>
  rand(
    Math.max(550, 2300 - (level - 1) * 140),
    Math.max(1400, 4200 - (level - 1) * 220),
  );

function makeDoors(): Door[] {
  return Array.from({ length: NUM_DOORS }, (_, id) => ({
    id,
    open: false,
    progress: 0,
    windowMs: windowForLevel(1),
    // stagger the initial openings so the barn doesn't erupt at once
    cooldownMs: rand(700, 4200),
  }));
}

function freshGame(): Game {
  return {
    phase: "idle",
    points: START_POINTS,
    saved: 0,
    escaped: 0,
    doors: makeDoors(),
  };
}

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

type Action =
  | { type: "start" }
  | { type: "tick" }
  | { type: "shut"; id: number };

function reducer(state: Game, action: Action): Game {
  switch (action.type) {
    case "start":
      return { ...freshGame(), phase: "playing" };

    case "shut": {
      if (state.phase !== "playing") return state;
      const door = state.doors.find((d) => d.id === action.id);
      if (!door || !door.open) return state;

      const level = levelFor(state.saved + 1);
      // quicker reactions earn a small reflex bonus on top of the base reward
      const reflexBonus = Math.round((1 - door.progress) * 3);
      const doors = state.doors.map((d) =>
        d.id === action.id
          ? {
              ...d,
              open: false,
              progress: 0,
              cooldownMs: cooldownForLevel(level),
              windowMs: windowForLevel(level),
            }
          : d,
      );
      return {
        ...state,
        doors,
        saved: state.saved + 1,
        points: state.points + SHUT_REWARD + reflexBonus,
      };
    }

    case "tick": {
      if (state.phase !== "playing") return state;

      const level = levelFor(state.saved);
      let points = state.points;
      let escaped = state.escaped;

      const doors = state.doors.map((d) => {
        if (d.open) {
          const progress = d.progress + TICK_MS / d.windowMs;
          if (progress >= 1) {
            // the turkey got out — lose genetic improvement points
            points -= ESCAPE_PENALTY;
            escaped += 1;
            return {
              ...d,
              open: false,
              progress: 0,
              cooldownMs: cooldownForLevel(level),
              windowMs: windowForLevel(level),
            };
          }
          return { ...d, progress };
        }
        // closed: count down toward the next gust that pops the door open
        const cooldownMs = d.cooldownMs - TICK_MS;
        if (cooldownMs <= 0) {
          return { ...d, open: true, progress: 0, windowMs: windowForLevel(level) };
        }
        return { ...d, cooldownMs };
      });

      const phase: Phase = points <= 0 ? "over" : "playing";
      return { ...state, doors, points: Math.max(points, 0), escaped, phase };
    }

    default:
      return state;
  }
}

/* Best run is backed by localStorage and read through an external store so it
   stays in sync without setState-in-effect and renders 0 on the server. */
const BEST_KEY = "turkeyBarnBest";
const bestListeners = new Set<() => void>();

function readBest(): number {
  if (typeof window === "undefined") return 0;
  const v = Number(window.localStorage.getItem(BEST_KEY));
  return Number.isFinite(v) ? v : 0;
}

function subscribeBest(cb: () => void) {
  bestListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    bestListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function saveBest(n: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BEST_KEY, String(n));
  bestListeners.forEach((cb) => cb());
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TurkeyBarnGame() {
  const [game, dispatch] = useReducer(reducer, undefined, freshGame);
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);

  // Game loop — a single interval drives every door.
  useEffect(() => {
    if (game.phase !== "playing") return;
    const interval = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(interval);
  }, [game.phase]);

  // Persist a new high score when a run ends.
  useEffect(() => {
    if (game.phase === "over" && game.saved > best) saveBest(game.saved);
  }, [game.phase, game.saved, best]);

  const shut = useCallback((id: number) => dispatch({ type: "shut", id }), []);

  const level = levelFor(game.saved);
  const pointsPct = Math.max(0, Math.min(100, (game.points / START_POINTS) * 100));
  const low = game.points <= 30;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Heading */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🦃</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Turkey Barn Door</h1>
        <p className="text-[var(--muted-light)] mt-2 max-w-xl mx-auto">
          Doors keep blowing open. Tap a door to slam it shut before the turkey escapes and
          bank <span className="text-[var(--accent-light)] font-semibold">genetic improvement points</span>.
          Let too many birds bolt and your farm goes bankrupt.
        </p>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Genetic Points" value={Math.round(game.points)} accent={low ? "danger" : "accent"} />
        <Stat label="Turkeys Saved" value={game.saved} accent="success" />
        <Stat label="Escaped" value={game.escaped} accent="warning" />
        <Stat label="Level" value={level} accent="accent" />
      </div>

      {/* Genetic points bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
          <span>Herd genetics</span>
          <span>Best run: {best} saved</span>
        </div>
        <div className="stat-bar h-2.5">
          <div
            className={`stat-bar-fill ${low ? "animate-pulse" : ""}`}
            style={{
              width: `${pointsPct}%`,
              background: low ? "var(--danger)" : pointsPct < 60 ? "var(--warning)" : "var(--success)",
            }}
          />
        </div>
      </div>

      {/* Barn */}
      <div className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6">
        <div className="absolute inset-x-0 -top-px h-8 rounded-t-2xl bg-gradient-to-b from-[var(--danger)]/20 to-transparent pointer-events-none" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {game.doors.map((door) => (
            <DoorButton key={door.id} door={door} disabled={game.phase !== "playing"} onShut={shut} />
          ))}
        </div>

        {/* Overlays */}
        {game.phase !== "playing" && (
          <div className="absolute inset-0 rounded-2xl bg-[var(--background)]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
              {game.phase === "idle" ? (
                <>
                  <div className="text-5xl mb-3">🚜</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to run the barn?</h2>
                  <p className="text-[var(--muted-light)] text-sm mb-5">
                    You start with {START_POINTS} genetic improvement points. Each saved turkey
                    earns {SHUT_REWARD}+ points; each escape costs {ESCAPE_PENALTY}. Hit zero and
                    you&apos;re bankrupt.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">💸</div>
                  <h2 className="text-2xl font-bold text-[var(--danger)] mb-2">Bankrupt!</h2>
                  <p className="text-[var(--muted-light)] text-sm mb-1">
                    You saved <span className="text-[var(--success)] font-semibold">{game.saved}</span> turkeys
                    but {game.escaped} got away.
                  </p>
                  <p className="text-[var(--muted)] text-xs mb-5">
                    {game.saved >= best && game.saved > 0 ? "🏆 New best run!" : `Best run: ${best} saved`}
                  </p>
                </>
              )}
              <button
                onClick={() => dispatch({ type: "start" })}
                className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                {game.phase === "idle" ? "Open the Barn" : "Try Again"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[var(--muted)] mt-4">
        Tip: shut doors the instant they swing open for a reflex bonus. The farm gets busier every level.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "accent" | "success" | "warning" | "danger";
}) {
  const color = `var(--${accent})`;
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-center">
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
    </div>
  );
}

function DoorButton({
  door,
  disabled,
  onShut,
}: {
  door: Door;
  disabled: boolean;
  onShut: (id: number) => void;
}) {
  const danger = door.progress > 0.6;
  return (
    <button
      type="button"
      disabled={disabled || !door.open}
      onClick={() => onShut(door.id)}
      aria-label={door.open ? "Open barn door — tap to shut" : "Closed barn door"}
      className={`relative aspect-[3/4] rounded-lg overflow-hidden transition-transform duration-100 select-none
        ${door.open ? "cursor-pointer active:scale-95 ring-2" : "cursor-default"}
      `}
      style={{
        background: door.open ? "#1a120b" : "#5b3a1e",
        boxShadow: door.open ? "inset 0 0 0 2px #2a1c10" : "inset 0 -6px 0 0 rgba(0,0,0,0.25)",
        // ring color reflects how urgent this door is
        ...(door.open
          ? ({ "--tw-ring-color": danger ? "var(--danger)" : "var(--warning)" } as React.CSSProperties)
          : {}),
      }}
    >
      {door.open ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl sm:text-5xl"
            style={{ transform: `translateY(${(1 - door.progress) * 18}px) scale(${0.85 + door.progress * 0.25})` }}
          >
            🦃
          </span>
          {/* escape progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
            <div
              className="h-full transition-[width] duration-100"
              style={{
                width: `${door.progress * 100}%`,
                background: danger ? "var(--danger)" : "var(--warning)",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* closed door — two planks */}
          <div className="absolute inset-2 rounded border-2 border-[#3f2814]" />
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5 bg-[#3f2814]" />
          <span className="text-2xl opacity-70">🚪</span>
        </div>
      )}
    </button>
  );
}
