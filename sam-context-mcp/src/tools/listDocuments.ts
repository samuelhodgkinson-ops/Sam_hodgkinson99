import { getDocumentIndex } from "../lib/metadata.js";

/** Returns all available context documents with metadata */
export async function handleListDocuments(): Promise<string> {
  const index = await getDocumentIndex();
  // Return a summary view sorted by priority
  const summary = index
    .sort((a, b) => a.priority - b.priority)
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      summary: doc.summary,
      tags: doc.tags,
      priority: doc.priority,
      lastUpdated: doc.lastUpdated,
    }));
  return JSON.stringify(summary, null, 2);
}
