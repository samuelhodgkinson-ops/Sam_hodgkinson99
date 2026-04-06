import { getProfile } from "../lib/metadata.js";

/** Returns the user's profile summary from data/profile.json */
export async function handleGetProfile(): Promise<string> {
  const profile = await getProfile();
  return JSON.stringify(profile, null, 2);
}
