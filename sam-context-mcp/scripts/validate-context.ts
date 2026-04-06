import { join } from "node:path";

// Import the validation logic from src/lib
// When running via tsx, we can import TypeScript directly
const ROOT = new URL("..", import.meta.url).pathname;

// Inline validation to avoid complex import resolution issues with tsx
import { readFile, access } from "node:fs/promises";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string(),
  role: z.string(),
  organization: z.string(),
  startDate: z.string(),
  fullTimeDate: z.string(),
  location: z.string(),
  previousLocation: z.string(),
  reportsTo: z.string(),
  functionalLine: z.string(),
  domains: z.array(z.string()),
  background: z.array(z.string()),
  communicationStyle: z.object({
    tone: z.string(),
    format: z.string(),
    uncertaintyLabeling: z.boolean(),
    noFiller: z.boolean(),
  }),
  lastUpdated: z.string(),
});

const DocumentEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  lastUpdated: z.string(),
  priority: z.number().int().min(1).max(5),
});

const DocumentIndexSchema = z.array(DocumentEntrySchema);

const REQUIRED_SECTIONS = [
  "## Purpose",
  "## Current State",
  "## Key Facts",
  "## Operating Implications",
  "## Open Questions",
  "## Update Triggers",
];

async function validate() {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log("Validating sam-context-mcp repository...\n");

  // 1. Validate profile.json
  console.log("  Checking data/profile.json...");
  try {
    const profileRaw = await readFile(join(ROOT, "data/profile.json"), "utf-8");
    const profileData = JSON.parse(profileRaw);
    ProfileSchema.parse(profileData);
    console.log("  ✓ profile.json is valid");
  } catch (e) {
    errors.push(`profile.json: ${e instanceof Error ? e.message : String(e)}`);
    console.log("  ✗ profile.json FAILED");
  }

  // 2. Validate document-index.json
  console.log("  Checking data/document-index.json...");
  let index: z.infer<typeof DocumentIndexSchema> = [];
  try {
    const indexRaw = await readFile(join(ROOT, "data/document-index.json"), "utf-8");
    const indexData = JSON.parse(indexRaw);
    index = DocumentIndexSchema.parse(indexData);
    console.log(`  ✓ document-index.json is valid (${index.length} entries)`);
  } catch (e) {
    errors.push(`document-index.json: ${e instanceof Error ? e.message : String(e)}`);
    console.log("  ✗ document-index.json FAILED");
  }

  // 3. Check unique IDs
  console.log("  Checking for unique IDs...");
  const ids = index.map((d) => d.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    errors.push(`Duplicate IDs: ${dupes.join(", ")}`);
    console.log("  ✗ Duplicate IDs found");
  } else {
    console.log(`  ✓ All ${ids.length} IDs are unique`);
  }

  // 4. Check referenced files exist and have required sections
  console.log("  Checking referenced files...");
  for (const doc of index) {
    const fullPath = join(ROOT, doc.path);
    try {
      await access(fullPath);
      const content = await readFile(fullPath, "utf-8");

      // Decision log has a different structure
      if (doc.id === "decision-log") {
        console.log(`  ✓ ${doc.path} exists (decision log — custom format)`);
        continue;
      }

      const missingSections: string[] = [];
      for (const section of REQUIRED_SECTIONS) {
        if (!content.includes(section)) {
          missingSections.push(section);
        }
      }
      if (missingSections.length > 0) {
        warnings.push(`${doc.path} missing sections: ${missingSections.join(", ")}`);
        console.log(`  ⚠ ${doc.path} — missing ${missingSections.length} sections`);
      } else {
        console.log(`  ✓ ${doc.path} — all sections present`);
      }
    } catch {
      errors.push(`File not found: ${doc.path}`);
      console.log(`  ✗ ${doc.path} NOT FOUND`);
    }
  }

  // 5. Validate tags.json
  console.log("  Checking data/tags.json...");
  try {
    const tagsRaw = await readFile(join(ROOT, "data/tags.json"), "utf-8");
    JSON.parse(tagsRaw);
    console.log("  ✓ tags.json is valid JSON");
  } catch (e) {
    errors.push(`tags.json: ${e instanceof Error ? e.message : String(e)}`);
    console.log("  ✗ tags.json FAILED");
  }

  // 6. Validate aliases.json
  console.log("  Checking data/aliases.json...");
  try {
    const aliasesRaw = await readFile(join(ROOT, "data/aliases.json"), "utf-8");
    JSON.parse(aliasesRaw);
    console.log("  ✓ aliases.json is valid JSON");
  } catch (e) {
    errors.push(`aliases.json: ${e instanceof Error ? e.message : String(e)}`);
    console.log("  ✗ aliases.json FAILED");
  }

  // Summary
  console.log("\n--- Validation Summary ---");
  console.log(`Errors:   ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log("\nErrors:");
    errors.forEach((e) => console.log(`  ✗ ${e}`));
  }
  if (warnings.length > 0) {
    console.log("\nWarnings:");
    warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }

  if (errors.length === 0) {
    console.log("\n✓ Repository is valid.");
  } else {
    console.log("\n✗ Validation failed.");
    process.exit(1);
  }
}

validate().catch((err) => {
  console.error("Validation script error:", err);
  process.exit(1);
});
