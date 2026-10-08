/** En dessous, une recherche renvoie surtout du bruit et consomme le quota pour rien. */
export const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 100;

/** Nettoie une requête venant de l'URL ou d'un champ : texte sur une ligne, longueur bornée. */
export function normalizeSearchQuery(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_LENGTH);
}

export function isSearchable(query: string): boolean {
  return query.length >= MIN_SEARCH_LENGTH;
}
