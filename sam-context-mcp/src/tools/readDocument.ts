import { getDocumentIndex } from "../lib/metadata.js";
import { loadText } from "../lib/fileLoader.js";

/** Returns the markdown content of a specific document by ID */
export async function handleReadDocument(id: string): Promise<string> {
  const index = await getDocumentIndex();
  const doc = index.find((d) => d.id === id);

  if (!doc) {
    const available = index.map((d) => d.id).join(", ");
    throw new Error(`Document not found: "${id}". Available IDs: ${available}`);
  }

  const content = await loadText(doc.path);
  return content;
}
