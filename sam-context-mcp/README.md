# sam-context-mcp

A private MCP (Model Context Protocol) server that provides structured, persistent context about Sam Hodgkinson for AI agent retrieval.

## Purpose

This repository is the **canonical source of truth** for who Sam is, what he's working on, how he communicates, and what decisions he has made. It is designed for **machine retrieval**, not just human browsing.

AI agents connect to this server via MCP and can:
- Retrieve Sam's profile and background
- Browse and read structured context documents
- Search across all context by keyword
- Access the decision log

## What is canonical

- `context/` markdown files are the **primary source** — edit these directly
- `data/profile.json` is the **profile of record**
- `data/document-index.json` is the **master index** — can be rebuilt from context files via `npm run build:index`
- `prompts/` contains agent instructions (system prompt, style rules, ingestion rules)

## MCP Tools Exposed

| Tool | Description |
|------|-------------|
| `get_profile` | Returns profile summary (role, location, background, style) |
| `list_documents` | Returns all context documents with metadata |
| `read_document` | Returns full markdown of a document by ID |
| `search_context` | Keyword search across titles, tags, summaries, and content |
| `get_recent_decisions` | Returns structured decision log entries |

All tools are **read-only** in V1.

## Security Boundaries

- **Private repository** — do not make public
- **No secrets** — do not store passwords, API keys, tokens, or credentials
- **No primary records** — do not store original contracts, legal documents, or confidential company data
- **No PII beyond what is intentionally documented** — the profile contains Sam's name and role; do not add addresses, phone numbers, financial account details, etc.
- **Read-only** — V1 has no write-back capability

## Update Cadence

- Context files: update as facts change or after major decisions
- Decision log: update after each significant decision
- Profile: update on role, location, or org changes
- Recommended review: weekly or after significant events

## Setup

### Prerequisites

- Node.js >= 20
- npm

### Install and build

```bash
cd sam-context-mcp
npm install
npm run build
```

### Run locally

```bash
# Development mode (auto-reload)
npm run dev

# Production
npm start
```

### Validate context

```bash
npm run validate
```

### Rebuild document index

```bash
npm run build:index
```

### Export context bundle

```bash
npm run export:bundle
```

This creates `data/context-bundle.md` — a single file containing all context, useful for systems that cannot connect via MCP.

## Connect to Claude Desktop

Add to your Claude Desktop MCP configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "sam-context": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/sam-context-mcp/src/server.ts"]
    }
  }
}
```

## Connect to Claude Code

Add to your Claude Code MCP settings (`.claude/settings.json` or project settings):

```json
{
  "mcpServers": {
    "sam-context": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/sam-context-mcp/src/server.ts"]
    }
  }
}
```

## Repository Structure

```
sam-context-mcp/
├── README.md
├── LICENSE
├── package.json
├── tsconfig.json
├── context/           # Canonical markdown context documents
│   ├── identity.md
│   ├── role-and-responsibilities.md
│   ├── current-projects.md
│   ├── team-and-relationships.md
│   ├── tools-and-systems.md
│   ├── communication-style.md
│   ├── goals-and-priorities.md
│   ├── preferences-and-constraints.md
│   ├── domain-knowledge.md
│   ├── decision-log.md
│   └── inbox/
│       └── raw-notes.md
├── data/              # Structured metadata (JSON)
│   ├── profile.json
│   ├── document-index.json
│   ├── tags.json
│   └── aliases.json
├── prompts/           # Agent instructions
│   ├── system-prompt.md
│   ├── context-ingestion-rules.md
│   └── writing-rules.md
├── scripts/           # Maintenance scripts
│   ├── build-index.ts
│   ├── validate-context.ts
│   └── export-bundle.ts
└── src/               # MCP server source
    ├── server.ts
    ├── lib/
    │   ├── fileLoader.ts
    │   ├── metadata.ts
    │   ├── searchIndex.ts
    │   ├── excerpt.ts
    │   └── validation.ts
    ├── schemas/
    │   ├── documentSchema.ts
    │   └── profileSchema.ts
    └── tools/
        ├── getProfile.ts
        ├── listDocuments.ts
        ├── readDocument.ts
        ├── searchContext.ts
        └── getRecentDecisions.ts
```

## What NOT to store in this repo

- Passwords, API keys, tokens, or secrets
- Original contracts or legal documents
- Confidential company financials or board materials
- Personal financial account numbers
- Immigration documents or government IDs
- Information about others without their consent
