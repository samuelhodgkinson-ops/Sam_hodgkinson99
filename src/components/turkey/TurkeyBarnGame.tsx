"use client";

import { useCallback, useEffect, useReducer, useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/*  Levels                                                             */
/* ------------------------------------------------------------------ */

interface Level {
  name: string;
  animal: string; // the critter trying to escape
  keeper: string; // the avatar you drive with the arrows
  closed: string; // icon shown on a shut pen/gate/net
  escape: string; // flavour verb for an escape
  enclosure: string; // barn/tank background
  openBg: string; // colour of an open pen
  closedBg: string; // colour of a shut pen
  plank: string; // detail colour on a shut pen
}

// Six levels — you climb through them as you save more animals.
const LEVELS: Level[] = [
  {
    name: "Turkeys in the Barn",
    animal: "🦃", keeper: "🧑‍🌾", closed: "🚪", escape: "escaped",
    enclosure: "#2a1a0e", openBg: "#3d2817", closedBg: "#5b3a1e", plank: "#7a5230",
  },
  {
    name: "Hen Layers in the Barn",
    animal: "🐔", keeper: "🧑‍🌾", closed: "🚪", escape: "flew the coop",
    enclosure: "#2b2610", openBg: "#3d3717", closedBg: "#6b591e", plank: "#8a7530",
  },
  {
    name: "Chickens in an African Field",
    animal: "🐓", keeper: "🧑‍🌾", closed: "🚧", escape: "ran into the bush",
    enclosure: "#123010", openBg: "#1d4317", closedBg: "#356b1e", plank: "#4d8a2e",
  },
  {
    name: "Salmon Underwater",
    animal: "🐟", keeper: "🤿", closed: "🥅", escape: "swam off",
    enclosure: "#0a2a3a", openBg: "#0f3d52", closedBg: "#1e5b6b", plank: "#2e7f94",
  },
  {
    name: "Shrimp Underwater",
    animal: "🦐", keeper: "🤿", closed: "🥅", escape: "darted away",
    enclosure: "#0a2438", openBg: "#0f2f52", closedBg: "#1e3f6b", plank: "#2e5f94",
  },
  {
    name: "The Office — Retention Floor",
    animal: "🏃", keeper: "🧑‍💼", closed: "🚪", escape: "walked out",
    enclosure: "#1b1b22", openBg: "#26262e", closedBg: "#3a3a46", plank: "#55556a",
  },
];

/* ------------------------------------------------------------------ */
/*  Game model                                                         */
/* ------------------------------------------------------------------ */

const COLS = 3;
const ROWS = 2;
const NUM_DOORS = COLS * ROWS; // 6 pens
const START_POINTS = 100;
const SHUT_REWARD = 4; // base genetic improvement points per pen shut
const ESCAPE_PENALTY = 12; // points lost when an animal escapes
const TICK_MS = 100;
const SAVES_PER_LEVEL = 8;
const WIN_SAVES = SAVES_PER_LEVEL * LEVELS.length; // clear all six levels

type Phase = "idle" | "playing" | "over" | "won";
type Dir = "up" | "down" | "left" | "right";

interface Door {
  id: number;
  open: boolean;
  progress: number; // 0 → 1, how close the animal is to escaping
  windowMs: number; // total time the pen stays open before the animal bolts
  cooldownMs: number; // time left (while shut) before the pen swings open
}

interface Game {
  phase: Phase;
  points: number;
  saves: number;
  escaped: number;
  keeper: number; // pen index (0..5) the keeper is standing at
  doors: Door[];
}

/* Which level (1..6) you're on, and how hard the pens are behaving. */
const stageFor = (saves: number) =>
  Math.min(LEVELS.length, Math.floor(saves / SAVES_PER_LEVEL) + 1);
const diffFor = (saves: number) => Math.floor(saves / 4) + 1;

const windowForDiff = (diff: number) => Math.max(720, 2500 - (diff - 1) * 110);

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const cooldownForDiff = (diff: number) =>
  rand(
    Math.max(520, 2200 - (diff - 1) * 120),
    Math.max(1300, 3900 - (diff - 1) * 190),
  );

function makeDoors(): Door[] {
  return Array.from({ length: NUM_DOORS }, (_, id) => ({
    id,
    open: false,
    progress: 0,
    windowMs: windowForDiff(1),
    // stagger the initial openings so the barn doesn't erupt at once
    cooldownMs: rand(800, 4200),
  }));
}

function freshGame(): Game {
  return {
    phase: "idle",
    points: START_POINTS,
    saves: 0,
    escaped: 0,
    keeper: 0,
    doors: makeDoors(),
  };
}

/* Slam the pen the keeper is standing at, if it's open. Pure. */
function shutCell(state: Game, idx: number): Game {
  const door = state.doors[idx];
  if (!door || !door.open) return state;

  const saves = state.saves + 1;
  const diff = diffFor(saves);
  // quicker reactions earn a small reflex bonus on top of the base reward
  const reflexBonus = Math.round((1 - door.progress) * 3);
  const doors = state.doors.map((d) =>
    d.id === idx
      ? {
          ...d,
          open: false,
          progress: 0,
          cooldownMs: cooldownForDiff(diff),
          windowMs: windowForDiff(diff),
        }
      : d,
  );
  const phase: Phase = saves >= WIN_SAVES ? "won" : state.phase;
  return { ...state, doors, saves, points: state.points + SHUT_REWARD + reflexBonus, phase };
}

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

type Action =
  | { type: "start" }
  | { type: "tick" }
  | { type: "move"; dir: Dir }
  | { type: "shut" };

function reducer(state: Game, action: Action): Game {
  switch (action.type) {
    case "start":
      return { ...freshGame(), phase: "playing" };

    case "move": {
      if (state.phase !== "playing") return state;
      const row = Math.floor(state.keeper / COLS);
      const col = state.keeper % COLS;
      let nr = row;
      let nc = col;
      if (action.dir === "up") nr = Math.max(0, row - 1);
      else if (action.dir === "down") nr = Math.min(ROWS - 1, row + 1);
      else if (action.dir === "left") nc = Math.max(0, col - 1);
      else if (action.dir === "right") nc = Math.min(COLS - 1, col + 1);
      const idx = nr * COLS + nc;
      // move, then slam the pen we just arrived at if it's open
      return shutCell({ ...state, keeper: idx }, idx);
    }

    case "shut":
      if (state.phase !== "playing") return state;
      return shutCell(state, state.keeper);

    case "tick": {
      if (state.phase !== "playing") return state;

      const diff = diffFor(state.saves);
      let points = state.points;
      let escaped = state.escaped;

      const doors = state.doors.map((d) => {
        if (d.open) {
          const progress = d.progress + TICK_MS / d.windowMs;
          if (progress >= 1) {
            // the animal got out — lose genetic improvement points
            points -= ESCAPE_PENALTY;
            escaped += 1;
            return {
              ...d,
              open: false,
              progress: 0,
              cooldownMs: cooldownForDiff(diff),
              windowMs: windowForDiff(diff),
            };
          }
          return { ...d, progress };
        }
        // shut: count down toward the next gust that pops the pen open
        const cooldownMs = d.cooldownMs - TICK_MS;
        if (cooldownMs <= 0) {
          return { ...d, open: true, progress: 0, windowMs: windowForDiff(diff) };
        }
        return { ...d, cooldownMs };
      });

      // a pen that opens right where the keeper stands is slammed instantly
      const guarded = shutCell({ ...state, doors, points, escaped }, state.keeper);
      const phase: Phase = guarded.points <= 0 ? "over" : guarded.phase;
      return { ...guarded, points: Math.max(guarded.points, 0), phase };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Best-run store (localStorage-backed external store)                */
/* ------------------------------------------------------------------ */

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

  // Game loop — a single interval drives every pen.
  useEffect(() => {
    if (game.phase !== "playing") return;
    const interval = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(interval);
  }, [game.phase]);

  // Keyboard controls — arrows move the keeper, space slams the current pen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      const control = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Spacebar"];
      if (control.includes(k)) e.preventDefault();

      if (game.phase === "playing") {
        if (k === "ArrowUp") dispatch({ type: "move", dir: "up" });
        else if (k === "ArrowDown") dispatch({ type: "move", dir: "down" });
        else if (k === "ArrowLeft") dispatch({ type: "move", dir: "left" });
        else if (k === "ArrowRight") dispatch({ type: "move", dir: "right" });
        else if (k === " " || k === "Spacebar") dispatch({ type: "shut" });
      } else if (k === "Enter" || k === " " || k === "Spacebar") {
        dispatch({ type: "start" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game.phase]);

  // Persist a new high score when a run ends (bankrupt or victory).
  useEffect(() => {
    if ((game.phase === "over" || game.phase === "won") && game.saves > best) {
      saveBest(game.saves);
    }
  }, [game.phase, game.saves, best]);

  const move = useCallback((dir: Dir) => dispatch({ type: "move", dir }), []);

  const stage = stageFor(game.saves);
  const level = LEVELS[stage - 1];
  const diff = diffFor(game.saves);
  const savesIntoLevel = Math.min(SAVES_PER_LEVEL, game.saves - (stage - 1) * SAVES_PER_LEVEL);
  const pointsPct = Math.max(0, Math.min(100, (game.points / START_POINTS) * 100));
  const low = game.points <= 30;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Heading */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{level.animal}</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Barn Door Keeper</h1>
        <p className="text-[var(--muted-light)] mt-2 max-w-xl mx-auto">
          Drive your keeper with the <span className="text-white font-semibold">arrow keys</span> and
          reach an open pen to slam it shut before the animal escapes. Bank{" "}
          <span className="text-[var(--accent-light)] font-semibold">genetic improvement points</span>{" "}
          — hit zero and your operation goes bankrupt.
        </p>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Genetic Points" value={Math.round(game.points)} accent={low ? "danger" : "accent"} />
        <Stat label="Saved" value={game.saves} accent="success" />
        <Stat label="Escaped" value={game.escaped} accent="warning" />
        <Stat label={`Level ${stage}/${LEVELS.length}`} value={savesIntoLevel} suffix={`/${SAVES_PER_LEVEL}`} accent="accent" />
      </div>

      {/* Level banner */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-white">
          <span className="text-[var(--muted)]">Level {stage}:</span> {level.name}
        </div>
        <div className="text-xs text-[var(--muted)]">Best run: {best} saved</div>
      </div>

      {/* Genetic points bar */}
      <div className="stat-bar h-2.5 mb-5">
        <div
          className={`stat-bar-fill ${low ? "animate-pulse" : ""}`}
          style={{
            width: `${pointsPct}%`,
            background: low ? "var(--danger)" : pointsPct < 60 ? "var(--warning)" : "var(--success)",
          }}
        />
      </div>

      {/* Enclosure */}
      <div
        className="relative rounded-2xl border border-[var(--card-border)] p-4 sm:p-6 transition-colors duration-500"
        style={{ background: level.enclosure }}
      >
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {game.doors.map((door) => (
            <DoorCell key={door.id} door={door} level={level} isKeeper={game.keeper === door.id} />
          ))}
        </div>

        {/* Overlays */}
        {game.phase !== "playing" && (
          <div className="absolute inset-0 rounded-2xl bg-[var(--background)]/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
              {game.phase === "idle" && (
                <>
                  <div className="text-5xl mb-3">🕹️</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to run the farm?</h2>
                  <p className="text-[var(--muted-light)] text-sm mb-5">
                    Use the <span className="text-white font-semibold">arrow keys</span> (or the on-screen
                    D-pad) to move your keeper onto an open pen and slam it shut. Save{" "}
                    {SAVES_PER_LEVEL} in a row to advance through all {LEVELS.length} levels —
                    turkeys, hens, chickens, salmon, shrimp, and the office floor. Hit zero points and
                    you&apos;re bankrupt.
                  </p>
                </>
              )}
              {game.phase === "over" && (
                <>
                  <div className="text-5xl mb-3">💸</div>
                  <h2 className="text-2xl font-bold text-[var(--danger)] mb-2">Bankrupt!</h2>
                  <p className="text-[var(--muted-light)] text-sm mb-1">
                    You saved <span className="text-[var(--success)] font-semibold">{game.saves}</span>{" "}
                    animals but {game.escaped} {game.escaped === 1 ? "got" : "got"} away.
                  </p>
                  <p className="text-[var(--muted)] text-xs mb-5">
                    You reached <span className="text-white">Level {stage}</span> ·{" "}
                    {game.saves >= best && game.saves > 0 ? "🏆 New best run!" : `Best run: ${best} saved`}
                  </p>
                </>
              )}
              {game.phase === "won" && (
                <>
                  <div className="text-5xl mb-3">🏆</div>
                  <h2 className="text-2xl font-bold text-[var(--success)] mb-2">You cleared every level!</h2>
                  <p className="text-[var(--muted-light)] text-sm mb-5">
                    Turkeys, hens, chickens, salmon, shrimp and even the office floor — all kept in.
                    You saved {game.saves} with {game.escaped} escapes and{" "}
                    {Math.round(game.points)} genetic points banked.
                  </p>
                </>
              )}
              <button
                onClick={() => dispatch({ type: "start" })}
                className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                {game.phase === "idle" ? "Open the Barn" : "Play Again"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-screen D-pad (for touch / mouse) */}
      <div className="mt-5 flex flex-col items-center gap-2 select-none">
        <DpadButton dir="up" onMove={move} disabled={game.phase !== "playing"} label="▲" />
        <div className="flex gap-2">
          <DpadButton dir="left" onMove={move} disabled={game.phase !== "playing"} label="◀" />
          <DpadButton dir="down" onMove={move} disabled={game.phase !== "playing"} label="▼" />
          <DpadButton dir="right" onMove={move} disabled={game.phase !== "playing"} label="▶" />
        </div>
        <p className="text-center text-xs text-[var(--muted)] mt-2">
          Arrow keys or the D-pad move the keeper {level.keeper}. Reach an open pen to slam it shut for a
          reflex bonus. Difficulty {diff} — it gets busier every level.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Stat({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent: "accent" | "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-center">
      <div className="text-2xl font-bold" style={{ color: `var(--${accent})` }}>
        {value}
        {suffix && <span className="text-sm text-[var(--muted)]">{suffix}</span>}
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
    </div>
  );
}

function DpadButton({
  dir,
  label,
  disabled,
  onMove,
}: {
  dir: Dir;
  label: string;
  disabled: boolean;
  onMove: (dir: Dir) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`Move ${dir}`}
      // pointer-down keeps taps snappy and stops the button from stealing focus/scroll
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled) onMove(dir);
      }}
      className="w-14 h-14 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-white text-lg font-bold
        hover:bg-[var(--surface-light)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-none"
    >
      {label}
    </button>
  );
}

function DoorCell({
  door,
  level,
  isKeeper,
}: {
  door: Door;
  level: Level;
  isKeeper: boolean;
}) {
  const danger = door.progress > 0.6;
  return (
    <div
      aria-label={door.open ? "Open pen" : "Shut pen"}
      className={`relative aspect-[3/4] rounded-lg overflow-hidden transition-colors duration-200 ${
        isKeeper ? "ring-2 ring-[var(--accent-light)]" : door.open ? "ring-2" : ""
      }`}
      style={{
        background: door.open ? level.openBg : level.closedBg,
        boxShadow: door.open ? "inset 0 0 0 2px rgba(0,0,0,0.35)" : "inset 0 -6px 0 0 rgba(0,0,0,0.25)",
        ...(door.open && !isKeeper
          ? ({ "--tw-ring-color": danger ? "var(--danger)" : "var(--warning)" } as React.CSSProperties)
          : {}),
      }}
    >
      {door.open ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl sm:text-5xl"
            style={{
              transform: `translateY(${(1 - door.progress) * 18}px) scale(${0.85 + door.progress * 0.25})`,
            }}
          >
            {level.animal}
          </span>
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
          <div className="absolute inset-2 rounded border-2" style={{ borderColor: level.plank }} />
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5" style={{ background: level.plank }} />
          <span className="text-2xl opacity-70">{level.closed}</span>
        </div>
      )}

      {/* Keeper avatar sits on top of whichever pen you're guarding */}
      {isKeeper && (
        <span className="absolute bottom-1 right-1 text-2xl sm:text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
          {level.keeper}
        </span>
      )}
    </div>
  );
}
