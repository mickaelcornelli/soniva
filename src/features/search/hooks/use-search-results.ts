"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isSearchable } from "@/lib/search";
import type { SearchResults } from "@/types/music";
import { fetchSearchResults } from "../api/fetch-search-results";

interface UseSearchResultsOptions {
  /** Résultats déjà rendus par le serveur pour cette requête (lien partagé, rechargement). */
  initial?: { query: string; results: SearchResults } | null;
}

export function useSearchResults(query: string, { initial }: UseSearchResultsOptions = {}) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: ({ signal }) => fetchSearchResults(query, signal),
    enabled: isSearchable(query),
    initialData: initial?.query === query ? initial.results : undefined,
    // Pendant la frappe, on garde les résultats précédents au lieu de vider l'écran.
    placeholderData: keepPreviousData,
  });
}
