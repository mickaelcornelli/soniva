/** Shorter queries mostly return noise and waste quota. */
export const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 100;

/** Single line, bounded length. */
export function normalizeSearchQuery(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_LENGTH);
}

export function isSearchable(query: string): boolean {
  return query.length >= MIN_SEARCH_LENGTH;
}
