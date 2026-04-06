import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Resolve a path relative to the project root (two levels up from src/lib/) */
function projectRoot(): string {
  // When running via tsx, import.meta.url gives us the file URL.
  // We navigate from src/lib/ up to the project root.
  const thisDir = new URL(".", import.meta.url).pathname;
  return join(thisDir, "..", "..");
}

/** Read a JSON file from the project root and parse it */
export async function loadJson<T>(relativePath: string): Promise<T> {
  const fullPath = join(projectRoot(), relativePath);
  const raw = await readFile(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

/** Read a text/markdown file from the project root */
export async function loadText(relativePath: string): Promise<string> {
  const fullPath = join(projectRoot(), relativePath);
  return readFile(fullPath, "utf-8");
}

/** Get the absolute path for a project-relative path */
export function resolvePath(relativePath: string): string {
  return join(projectRoot(), relativePath);
}
