/**
 * Extract a short excerpt around a keyword match in text.
 * Returns up to `radius` characters before and after the match.
 */
export function extractExcerpt(
  text: string,
  keyword: string,
  radius: number = 150,
): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx === -1) return text.slice(0, radius * 2) + "...";

  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + keyword.length + radius);

  let excerpt = text.slice(start, end).trim();
  if (start > 0) excerpt = "..." + excerpt;
  if (end < text.length) excerpt = excerpt + "...";

  return excerpt;
}
