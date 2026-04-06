import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { DocumentIndexSchema } from "../schemas/documentSchema.js";
import { ProfileSchema } from "../schemas/profileSchema.js";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const REQUIRED_SECTIONS = [
  "## Purpose",
  "## Current State",
  "## Key Facts",
  "## Operating Implications",
  "## Open Questions",
  "## Update Triggers",
];

/**
 * Validate the entire context repository for consistency and completeness.
 */
export async function validateRepository(rootDir: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validate profile.json
  try {
    const profileRaw = await readFile(join(rootDir, "data/profile.json"), "utf-8");
    const profileData = JSON.parse(profileRaw);
    ProfileSchema.parse(profileData);
  } catch (e) {
    errors.push(`profile.json validation failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 2. Validate document-index.json
  let index: unknown[] = [];
  try {
    const indexRaw = await readFile(join(rootDir, "data/document-index.json"), "utf-8");
    const indexData = JSON.parse(indexRaw);
    index = DocumentIndexSchema.parse(indexData);
  } catch (e) {
    errors.push(`document-index.json validation failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 3. Check unique IDs
  const ids = (index as Array<{ id: string }>).map((d) => d.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    errors.push("Duplicate IDs found in document-index.json");
  }

  // 4. Check referenced files exist and have required sections
  for (const doc of index as Array<{ id: string; path: string }>) {
    const fullPath = join(rootDir, doc.path);
    try {
      await access(fullPath);
      const content = await readFile(fullPath, "utf-8");

      // Check for decision-log.md which has a different structure
      if (doc.id === "decision-log") continue;

      for (const section of REQUIRED_SECTIONS) {
        if (!content.includes(section)) {
          warnings.push(`${doc.path} missing section: ${section}`);
        }
      }
    } catch {
      errors.push(`Referenced file not found: ${doc.path}`);
    }
  }

  // 5. Validate tags.json
  try {
    const tagsRaw = await readFile(join(rootDir, "data/tags.json"), "utf-8");
    JSON.parse(tagsRaw);
  } catch (e) {
    errors.push(`tags.json is not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 6. Validate aliases.json
  try {
    const aliasesRaw = await readFile(join(rootDir, "data/aliases.json"), "utf-8");
    JSON.parse(aliasesRaw);
  } catch (e) {
    errors.push(`aliases.json is not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
