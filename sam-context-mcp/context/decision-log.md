# Decision Log

## Purpose
Structured log of key decisions with context, rationale, and outcomes. Used by `get_recent_decisions` tool.

## Format
Each decision entry uses the following structure:

---

## DECISION-001: Accept Hendrix Genetics Role

- **Date:** 2025-12-15
- **Status:** Decided
- **Context:** Offered dual role as Finance Director, BU Turkeys and Acceleration Lead at Hendrix Genetics. Required relocation from London to Oakville, Ontario.
- **Options considered:**
  1. Accept the role and relocate
  2. Decline and continue independent consulting
  3. Negotiate remote/hybrid arrangement
- **Decision:** Accept the role and relocate to Canada.
- **Rationale:** Strong career opportunity combining operational finance leadership with strategic transformation. Hendrix Genetics provides industry exposure and long-term growth potential. Relocation aligns with personal objectives.
- **Implications:** Immigration process initiated. Consulting company to be wound down or paused. Partner relocation required.
- **Review date:** 2026-06-15

---

## DECISION-002: AI Context System Architecture

- **Date:** 2026-04-06
- **Status:** Decided
- **Context:** Need a structured, persistent context system for AI agents to access information about Sam's role, priorities, and preferences.
- **Options considered:**
  1. Notion/wiki-based system
  2. MCP server with filesystem storage
  3. Vector database with semantic search
- **Decision:** MCP server with filesystem-based markdown and JSON storage.
- **Rationale:** Simplicity, portability, and version control compatibility. No external dependencies. Read-only V1 reduces risk. MCP protocol enables direct agent integration.
- **Implications:** Repository created as sam-context-mcp. Future versions may add write-back and richer search.
- **Review date:** 2026-07-06

---

## DECISION-003: D365 Costing Strategy

- **Date:** Pending
- **Status:** Open
- **Context:** D365 ERP transition for BU Turkeys requires a costing methodology decision. Options include standard costing, actual costing, or a hybrid approach.
- **Options considered:**
  1. Standard costing
  2. Actual costing
  3. Hybrid approach
- **Decision:** Pending — analysis in progress.
- **Rationale:** TBD
- **Implications:** Blocks downstream ERP configuration, reporting design, and financial close process design.
- **Review date:** 2026-04-30
