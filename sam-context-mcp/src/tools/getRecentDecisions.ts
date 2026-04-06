import { loadText } from "../lib/fileLoader.js";

interface DecisionEntry {
  id: string;
  title: string;
  date: string;
  status: string;
  context: string;
  decision: string;
}

/**
 * Parse the decision log markdown into structured entries.
 * Uses a simple section-based parser that splits on "## DECISION-" headers.
 * Falls back gracefully if the format doesn't match expectations.
 */
function parseDecisionLog(content: string): DecisionEntry[] {
  const sections = content.split(/(?=^## DECISION-)/m).filter((s) => s.startsWith("## DECISION-"));
  const entries: DecisionEntry[] = [];

  for (const section of sections) {
    try {
      // Extract ID and title from header: "## DECISION-001: Some Title"
      const headerMatch = section.match(/^## (DECISION-\d+):\s*(.+)/m);
      if (!headerMatch) continue;

      const id = headerMatch[1];
      const title = headerMatch[2].trim();

      // Extract fields using "- **Field:** Value" pattern
      const fieldValue = (field: string): string => {
        const re = new RegExp(`-\\s*\\*\\*${field}:\\*\\*\\s*(.+)`, "m");
        const match = section.match(re);
        return match ? match[1].trim() : "";
      };

      entries.push({
        id,
        title,
        date: fieldValue("Date"),
        status: fieldValue("Status"),
        context: fieldValue("Context"),
        decision: fieldValue("Decision"),
      });
    } catch {
      // Graceful fallback: skip malformed entries
      continue;
    }
  }

  return entries;
}

/** Returns the most recent decision entries from context/decision-log.md */
export async function handleGetRecentDecisions(limit: number = 10): Promise<string> {
  let content: string;
  try {
    content = await loadText("context/decision-log.md");
  } catch {
    throw new Error("Decision log not found at context/decision-log.md");
  }

  const entries = parseDecisionLog(content);

  if (entries.length === 0) {
    return JSON.stringify({
      entries: [],
      message: "No decision entries found. The decision log may be empty or in an unexpected format.",
      raw_available: true,
    });
  }

  // Sort by date descending (most recent first), treating "Pending" as latest
  const sorted = entries.sort((a, b) => {
    if (a.date === "Pending") return -1;
    if (b.date === "Pending") return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return JSON.stringify(sorted.slice(0, limit), null, 2);
}
