import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface DocumentEntry {
  id: string;
  title: string;
  path: string;
  summary: string;
  tags: string[];
  lastUpdated: string;
  priority: number;
}

const ROOT = new URL("..", import.meta.url).pathname;
const CONTEXT_DIR = join(ROOT, "context");
const INDEX_PATH = join(ROOT, "data", "document-index.json");

/** Extract the first markdown heading as title */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : "Untitled";
}

/** Generate an ID from a filename: "role-and-responsibilities.md" -> "role-and-responsibilities" */
function fileToId(filename: string): string {
  return filename.replace(/\.md$/, "");
}

async function main() {
  // Load existing index to preserve manually-set summaries and tags
  let existing: Map<string, DocumentEntry> = new Map();
  try {
    const raw = await readFile(INDEX_PATH, "utf-8");
    const parsed: DocumentEntry[] = JSON.parse(raw);
    for (const entry of parsed) {
      existing.set(entry.id, entry);
    }
    console.log(`Loaded existing index with ${existing.size} entries.`);
  } catch {
    console.log("No existing index found. Building from scratch.");
  }

  // Scan context/ for markdown files (top-level only, excluding subdirs)
  const files = await readdir(CONTEXT_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const today = new Date().toISOString().split("T")[0];
  const newIndex: DocumentEntry[] = [];

  for (const file of mdFiles) {
    const id = fileToId(file);
    const path = `context/${file}`;
    const content = await readFile(join(CONTEXT_DIR, file), "utf-8");
    const title = extractTitle(content);

    const prev = existing.get(id);

    newIndex.push({
      id,
      title,
      path,
      // Preserve existing summary/tags if available
      summary: prev?.summary || `Content from ${file}`,
      tags: prev?.tags || [],
      lastUpdated: prev?.lastUpdated || today,
      priority: prev?.priority || 3,
    });
  }

  // Sort by priority (ascending), then title
  newIndex.sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));

  await writeFile(INDEX_PATH, JSON.stringify(newIndex, null, 2) + "\n", "utf-8");
  console.log(`Index rebuilt with ${newIndex.length} entries -> ${INDEX_PATH}`);
}

main().catch((err) => {
  console.error("build-index failed:", err);
  process.exit(1);
});
