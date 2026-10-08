"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isSearchable } from "@/lib/search";
import type { SearchResults } from "@/types/music";
import { fetchSearchResults } from "../api/fetch-search-results";

/** Aligné sur le cache CDN de /api/search : inutile de redemander plus souvent. */
const SEARCH_STALE_TIME_MS = 5 * 60 * 1000;

interface UseSearchResultsOptions {
  /** Résultats déjà rendus par le serveur pour cette requête (lien partagé, rechargement). */
  initial?: { query: string; results: SearchResults } | null;
}

export function useSearchResults(query: string, { initial }: UseSearchResultsOptions = {}) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: ({ signal }) => fetchSearchResults(query, signal),
    enabled: isSearchable(query),
    // Explicite ici plutôt qu'hérité du client global : c'est ce qui garantit que les
    // résultats rendus par le serveur ne déclenchent pas un second appel au montage.
    staleTime: SEARCH_STALE_TIME_MS,
    initialData: initial?.query === query ? initial.results : undefined,
    // Pendant la frappe, on garde les résultats précédents au lieu de vider l'écran.
    placeholderData: keepPreviousData,
  });
}
