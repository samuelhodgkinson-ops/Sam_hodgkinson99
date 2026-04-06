import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

interface DocumentEntry {
  id: string;
  title: string;
  path: string;
  summary: string;
  tags: string[];
  lastUpdated: string;
  priority: number;
}

/**
 * Export all context as a single consolidated markdown file.
 * Useful for systems that cannot use MCP directly (e.g., pasting into a prompt).
 */
async function main() {
  // Load profile
  const profileRaw = await readFile(join(ROOT, "data/profile.json"), "utf-8");
  const profile = JSON.parse(profileRaw);

  // Load document index
  const indexRaw = await readFile(join(ROOT, "data/document-index.json"), "utf-8");
  const index: DocumentEntry[] = JSON.parse(indexRaw);

  const lines: string[] = [];

  lines.push("# Sam Hodgkinson — Context Bundle");
  lines.push("");
  lines.push(`*Exported: ${new Date().toISOString().split("T")[0]}*`);
  lines.push("");

  // Profile section
  lines.push("## Profile Summary");
  lines.push("");
  lines.push(`- **Name:** ${profile.name}`);
  lines.push(`- **Role:** ${profile.role}`);
  lines.push(`- **Organization:** ${profile.organization}`);
  lines.push(`- **Location:** ${profile.location}`);
  lines.push(`- **Reports to:** ${profile.reportsTo} (functional: ${profile.functionalLine})`);
  lines.push(`- **Domains:** ${profile.domains.join(", ")}`);
  lines.push(`- **Background:** ${profile.background.join(", ")}`);
  lines.push("");

  // Each document
  const sorted = [...index].sort((a, b) => a.priority - b.priority);
  for (const doc of sorted) {
    try {
      const content = await readFile(join(ROOT, doc.path), "utf-8");
      lines.push("---");
      lines.push("");
      lines.push(content.trim());
      lines.push("");
    } catch {
      lines.push(`---`);
      lines.push("");
      lines.push(`# ${doc.title}`);
      lines.push("");
      lines.push(`*[File not found: ${doc.path}]*`);
      lines.push("");
    }
  }

  const bundle = lines.join("\n");
  const outPath = join(ROOT, "data", "context-bundle.md");
  await writeFile(outPath, bundle, "utf-8");
  console.log(`Bundle exported to ${outPath} (${bundle.length} chars)`);
}

main().catch((err) => {
  console.error("export-bundle failed:", err);
  process.exit(1);
});
