import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { handleGetProfile } from "./tools/getProfile.js";
import { handleListDocuments } from "./tools/listDocuments.js";
import { handleReadDocument } from "./tools/readDocument.js";
import { handleSearchContext } from "./tools/searchContext.js";
import { handleGetRecentDecisions } from "./tools/getRecentDecisions.js";

const server = new McpServer({
  name: "sam-context-mcp",
  version: "1.0.0",
});

// Tool: get_profile
server.tool(
  "get_profile",
  "Returns a concise profile summary for Sam Hodgkinson including role, location, background, and communication preferences.",
  {},
  async () => {
    try {
      const result = await handleGetProfile();
      return { content: [{ type: "text", text: result }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
    }
  },
);

// Tool: list_documents
server.tool(
  "list_documents",
  "Returns all available context documents with metadata (id, title, summary, tags, priority, lastUpdated).",
  {},
  async () => {
    try {
      const result = await handleListDocuments();
      return { content: [{ type: "text", text: result }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
    }
  },
);

// Tool: read_document
server.tool(
  "read_document",
  "Returns the full markdown contents of a specific context document by its ID.",
  { id: z.string().describe("The document ID (e.g. 'identity', 'current-projects', 'decision-log')") },
  async ({ id }) => {
    try {
      const result = await handleReadDocument(id);
      return { content: [{ type: "text", text: result }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
    }
  },
);

// Tool: search_context
server.tool(
  "search_context",
  "Searches titles, tags, summaries, and markdown content across all context documents. Returns ranked results with excerpts.",
  { query: z.string().describe("Search query — can be a keyword, phrase, or topic") },
  async ({ query }) => {
    try {
      const result = await handleSearchContext(query);
      return { content: [{ type: "text", text: result }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
    }
  },
);

// Tool: get_recent_decisions
server.tool(
  "get_recent_decisions",
  "Returns the most recent structured decision entries from the decision log, including status, context, and rationale.",
  {},
  async () => {
    try {
      const result = await handleGetRecentDecisions();
      return { content: [{ type: "text", text: result }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
    }
  },
);

// Start the server on stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
