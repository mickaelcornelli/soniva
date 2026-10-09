"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isSearchable } from "@/lib/search";
import type { SearchResults } from "@/types/music";
import { fetchSearchResults } from "../api/fetch-search-results";

/** Matches the CDN cache of /api/search. */
const SEARCH_STALE_TIME_MS = 5 * 60 * 1000;

interface UseSearchResultsOptions {
  initial?: { query: string; results: SearchResults } | null;
}

export function useSearchResults(query: string, { initial }: UseSearchResultsOptions = {}) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: ({ signal }) => fetchSearchResults(query, signal),
    enabled: isSearchable(query),
    // Set explicitly rather than inherited: this is what stops server-
    // rendered results from triggering a second request on mount.
    staleTime: SEARCH_STALE_TIME_MS,
    initialData: initial?.query === query ? initial.results : undefined,
    // Keep previous results while typing instead of clearing the screen.
    placeholderData: keepPreviousData,
  });
}
