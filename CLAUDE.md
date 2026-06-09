# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The line above imports `AGENTS.md`, which carries an auto-managed warning that
> the installed Next.js is a **pre-release with breaking changes**. Before writing
> any Next.js code, read the relevant guide under `node_modules/next/dist/docs/`
> — APIs and conventions may differ from training data.

## Repository layout

This repo contains **two independent projects** that do not share a build, lockfile, or dependency tree:

1. **Root (`/`)** — `world-cup-explorer`, a Next.js 16 App Router web app for browsing FIFA World Cup 2026 teams, squads, fixtures, results, standings, and stats.
2. **`sam-context-mcp/`** — a standalone TypeScript MCP (Model Context Protocol) stdio server that exposes structured personal context about Sam Hodgkinson for AI agent retrieval. It has its own `package.json`, `tsconfig.json`, and `README.md`.

Run `npm install` separately in each directory. Commands below are relative to the project they belong to.

## Commands

### Root web app
```bash
npm run dev      # Next.js dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

### sam-context-mcp (run from `sam-context-mcp/`)
```bash
npm run dev            # tsx watch on src/server.ts (auto-reload)
npm run build          # tsc -> dist/
npm start              # run compiled server
npm run validate       # validate context files against schemas (scripts/validate-context.ts)
npm run build:index    # rebuild data/document-index.json from context/ markdown
npm run export:bundle  # write data/context-bundle.md (single-file dump of all context)
```

There is **no test runner** configured in either project. "Verifying" a change means `npm run lint` / `npm run build` (web app) or `npm run validate` (MCP server).

## Web app architecture

**Stack:** Next.js 16.2.2 (App Router) · React 19 · Tailwind CSS v4 (via `@tailwindcss/postcss`) · TypeScript strict. Path alias `@/*` → `src/*`.

**Data is fully static and lives in `src/data/`** — there is no database, API, or fetching. The app renders from hand-authored TypeScript modules:
- `teams-af.ts` (groups A–F) + `teams-gl.ts` (groups G–L) are merged by `teams.ts`. Keep team objects split across these two files when adding teams.
- `squads.ts` uses a compact tuple format expanded by the local `b()` helper into `Player` objects — match that tuple shape when editing rosters.
- `matches.ts` generates the 72 group-stage fixtures from `groups`/`venues` definitions; `standings.ts` seeds standings from per-group team+position arrays.
- `update-log.ts` holds `DataSource` provenance entries (source, URL, lastUpdated, confidence) surfaced via the `LastUpdated` UI component.

**Types** are centralized in `src/types/index.ts` (`Team`, `Player`, `Match`, `Standing`, `TeamStats`, `DataSource`, plus union types like `Confederation`, `MatchStage`). All data files and components import from `@/types`.

**Pages** (`src/app/.../page.tsx`) are mostly **client components** (`"use client"`) that import the static data modules directly and derive everything through pure helpers — there is little server-side rendering logic. Routes: `/`, `/teams` + `/teams/[teamId]`, `/groups` + `/groups/[groupId]`, `/matches` + `/matches/[matchId]`, `/standings`, `/compare`, `/search`. The root `layout.tsx` wraps pages in `Navigation` + `Footer`.

**`src/lib/utils.ts` holds the derivation/business logic** — standings sorting, fixture filtering, date/countdown formatting, squad aggregation, team filtering. Some values (recent pre-tournament results, advanced team stats) are **deterministically generated** from a team's `id`/`fifaRanking` via a seeded RNG (`seededRandom`), not stored — so they stay stable across renders. `src/lib/flags.ts` maps team ids to ISO-2 codes for `flagcdn.com` flag image URLs.

**Components** are split by concern under `src/components/`: `ui/` (generic primitives — `Card`, `Badge`, `SearchInput`, `TeamFlag`, `LastUpdated`), `team/` (domain panels — `SquadTable`, `GroupStandings`, `KeyPlayers`, etc.), and `layout/` (`Navigation`, `Footer`). Styling is Tailwind utility classes plus CSS variables (e.g. `var(--accent)`, `var(--card-bg)`) defined in `src/app/globals.css`.

## sam-context-mcp architecture

A read-only MCP stdio server (`@modelcontextprotocol/sdk`, ESM, runs via `tsx`). `src/server.ts` registers five tools, each delegating to a handler in `src/tools/`:

| Tool | Handler |
|------|---------|
| `get_profile` | `getProfile.ts` — profile summary from `data/profile.json` |
| `list_documents` | `listDocuments.ts` — metadata for all context docs |
| `read_document` | `readDocument.ts` — full markdown by id |
| `search_context` | `searchContext.ts` — keyword search over titles/tags/summaries/content |
| `get_recent_decisions` | `getRecentDecisions.ts` — entries from `context/decision-log.md` |

**Canonical content lives in `context/*.md`** (identity, role, current-projects, decision-log, etc.). `data/*.json` holds structured metadata: `profile.json` is the profile of record; `document-index.json` is the master index and is **regenerated** from the markdown via `npm run build:index` (don't hand-edit it). `prompts/` holds agent instructions.

**Key conventions:**
- ESM with `"type": "module"`: relative imports **must use `.js` extensions** even in `.ts` source (e.g. `import { handleGetProfile } from "./tools/getProfile.js"`).
- `src/lib/fileLoader.ts` resolves all paths from the project root using `import.meta.url`, so the server works regardless of CWD.
- Schemas in `src/schemas/` (zod) define the document/profile shapes; `npm run validate` checks `context/` and `data/` against them — run it after editing context.
- Tools are intentionally **read-only**; there is no write-back path. Per its README, this repo must contain **no secrets, credentials, or primary legal/financial records**.
