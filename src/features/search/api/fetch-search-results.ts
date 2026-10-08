import { routes } from "@/lib/routes";
import type { SearchResults } from "@/types/music";

/** Appelle notre API de recherche (déjà validée côté serveur par le provider). */
export async function fetchSearchResults(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResults> {
  const response = await fetch(routes.searchApi(query), { signal });
  if (!response.ok) throw new Error(`Recherche indisponible (${response.status}).`);
  return (await response.json()) as SearchResults;
}
