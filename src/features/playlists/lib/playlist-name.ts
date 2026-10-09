export const PLAYLIST_NAME_MAX_LENGTH = 100;

/** Same rule as the database constraint. */
export function normalizePlaylistName(raw: string): string | null {
  const name = raw.replace(/\s+/g, " ").trim().slice(0, PLAYLIST_NAME_MAX_LENGTH);
  return name.length > 0 ? name : null;
}
