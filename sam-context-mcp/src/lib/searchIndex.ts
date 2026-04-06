import { getDocumentIndex } from "./metadata.js";
import { loadText } from "./fileLoader.js";
import { extractExcerpt } from "./excerpt.js";
import type { DocumentEntry } from "../schemas/documentSchema.js";

interface SearchResult {
  id: string;
  title: string;
  score: number;
  excerpt: string;
  path: string;
}

/**
 * Search across all context documents using a simple scoring algorithm.
 *
 * Ranking:
 * - Exact title match: +10
 * - Tag match: +5 per matching tag
 * - Summary keyword match: +3
 * - Content keyword match: +1
 * - Recency boost: +1 if updated within last 30 days
 */
export async function searchContext(
  query: string,
  maxResults: number = 5,
): Promise<SearchResult[]> {
  const index = await getDocumentIndex();
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];

  for (const doc of index) {
    let score = 0;
    let bestExcerpt = doc.summary;

    // Title match — exact match scores highest, partial match also counts
    if (doc.title.toLowerCase() === queryLower) {
      score += 10;
    } else if (doc.title.toLowerCase().includes(queryLower)) {
      score += 7;
    } else {
      for (const term of queryTerms) {
        if (doc.title.toLowerCase().includes(term)) score += 3;
      }
    }

    // Tag match
    for (const tag of doc.tags) {
      for (const term of queryTerms) {
        if (tag.toLowerCase() === term) score += 5;
        else if (tag.toLowerCase().includes(term)) score += 2;
      }
    }

    // Summary match
    for (const term of queryTerms) {
      if (doc.summary.toLowerCase().includes(term)) score += 3;
    }

    // Content match — load the file and search
    let content = "";
    try {
      content = await loadText(doc.path);
      for (const term of queryTerms) {
        if (content.toLowerCase().includes(term)) {
          score += 1;
          bestExcerpt = extractExcerpt(content, term);
        }
      }
    } catch {
      // File not found — skip content scoring
    }

    // Recency boost: +1 if updated within last 30 days
    const lastUpdated = new Date(doc.lastUpdated);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (lastUpdated >= thirtyDaysAgo) {
      score += 1;
    }

    if (score > 0) {
      results.push({
        id: doc.id,
        title: doc.title,
        score,
        excerpt: bestExcerpt,
        path: doc.path,
      });
    }
  }

  // Sort by score descending, then by priority ascending (lower = more important)
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}
