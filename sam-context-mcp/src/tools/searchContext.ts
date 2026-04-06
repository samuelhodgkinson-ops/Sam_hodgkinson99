import { searchContext } from "../lib/searchIndex.js";

/** Searches across all context documents and returns ranked results with excerpts */
export async function handleSearchContext(query: string): Promise<string> {
  if (!query || query.trim().length === 0) {
    throw new Error("Query must not be empty.");
  }

  const results = await searchContext(query);

  if (results.length === 0) {
    return JSON.stringify({
      query,
      results: [],
      message: "No matching documents found.",
    });
  }

  return JSON.stringify({ query, results }, null, 2);
}
