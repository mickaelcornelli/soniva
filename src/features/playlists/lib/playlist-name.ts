export const PLAYLIST_NAME_MAX_LENGTH = 100;

/** Nettoie un nom saisi ; renvoie null s'il est vide (même règle que la contrainte en base). */
export function normalizePlaylistName(raw: string): string | null {
  const name = raw.replace(/\s+/g, " ").trim().slice(0, PLAYLIST_NAME_MAX_LENGTH);
  return name.length > 0 ? name : null;
}
