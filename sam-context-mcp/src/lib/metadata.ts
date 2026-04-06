import { loadJson } from "./fileLoader.js";
import { DocumentIndexSchema, type DocumentEntry } from "../schemas/documentSchema.js";
import { ProfileSchema, type Profile } from "../schemas/profileSchema.js";

let cachedIndex: DocumentEntry[] | null = null;
let cachedProfile: Profile | null = null;

/** Load and validate the document index, caching the result */
export async function getDocumentIndex(): Promise<DocumentEntry[]> {
  if (cachedIndex) return cachedIndex;
  const raw = await loadJson<unknown>("data/document-index.json");
  cachedIndex = DocumentIndexSchema.parse(raw);
  return cachedIndex;
}

/** Load and validate the profile, caching the result */
export async function getProfile(): Promise<Profile> {
  if (cachedProfile) return cachedProfile;
  const raw = await loadJson<unknown>("data/profile.json");
  cachedProfile = ProfileSchema.parse(raw);
  return cachedProfile;
}

/** Clear caches — useful if files change during a session */
export function clearMetadataCache(): void {
  cachedIndex = null;
  cachedProfile = null;
}
