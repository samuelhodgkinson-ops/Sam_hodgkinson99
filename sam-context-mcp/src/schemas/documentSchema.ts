import { z } from "zod";

export const DocumentEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  lastUpdated: z.string(),
  priority: z.number().int().min(1).max(5),
});

export const DocumentIndexSchema = z.array(DocumentEntrySchema);

export type DocumentEntry = z.infer<typeof DocumentEntrySchema>;

export const TagsFileSchema = z.object({
  tags: z.array(z.string()),
});

export const AliasesFileSchema = z.object({
  aliases: z.record(z.string(), z.string()),
});
