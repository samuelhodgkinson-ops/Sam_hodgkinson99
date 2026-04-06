# Context Ingestion Rules

## Purpose
Rules for how AI agents should ingest and use context from this repository.

## Rules

### Priority Order
1. Read `profile.json` for identity grounding
2. Check `document-index.json` for available context and priorities
3. Load high-priority documents first (priority 1)
4. Load remaining documents as needed for the specific task

### Freshness
- Always check `lastUpdated` fields
- Prefer more recently updated documents when context conflicts
- Flag stale documents (>90 days without update) to Sam

### Conflict Resolution
- If two documents contain conflicting information, prefer the one with a more recent `lastUpdated`
- If dates match, prefer the more specific document (e.g., `current-projects.md` over `goals-and-priorities.md` for project details)

### Scope Boundaries
- Only use information documented in this repository
- Do not supplement with external knowledge about Hendrix Genetics unless Sam requests it
- Mark any externally-sourced information clearly

### Search Strategy
1. Start with exact document if you know which one to read
2. Use `search_context` for cross-cutting queries
3. Use `list_documents` to discover relevant documents by tag
4. Fall back to reading all high-priority documents for broad questions

### What Not to Cache
- Do not cache context across sessions unless the agent framework supports explicit cache invalidation
- Always re-read on session start
