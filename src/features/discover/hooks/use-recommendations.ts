"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLibraryStore } from "@/features/library/store/library-store";
import { fetchRecommendations } from "../api/fetch-recommendations";
import { selectRecommendations } from "../lib/select-recommendations";
import { buildTasteProfile } from "../lib/taste-profile";

/** Matches the CDN cache of /api/discover. */
const DISCOVER_STALE_TIME_MS = 10 * 60 * 1000;
/** Stable reference: a default `[]` would recompute the selection on every render. */
const NO_EXCLUSION: readonly string[] = [];

interface UseRecommendationsOptions {
  excludeTrackIds?: readonly string[];
}

/** No request until there is at least one favourite or play to build on. */
export function useRecommendations({
  excludeTrackIds = NO_EXCLUSION,
}: UseRecommendationsOptions = {}) {
  const favorites = useLibraryStore((state) => state.favorites);
  const history = useLibraryStore((state) => state.history);

  const profile = useMemo(
    () =>
      buildTasteProfile(
        favorites.map((favorite) => favorite.track),
        history.map((play) => play.track),
      ),
    [favorites, history],
  );

  const { genres, topArtist } = profile;
  const artistId = topArtist?.id;
  const hasTaste = genres.length > 0 || artistId !== undefined;

  const query = useQuery({
    // Only the genres and the reference artist matter: a
    // new play that doesn't change them doesn't refetch.
    queryKey: ["discover", genres, artistId],
    queryFn: ({ signal }) => fetchRecommendations({ genres, artistId }, signal),
    enabled: hasTaste,
    staleTime: DISCOVER_STALE_TIME_MS,
  });

  const recommendations = useMemo(() => {
    if (!query.data) return undefined;
    const excluded = new Set([...profile.knownTrackIds, ...excludeTrackIds]);
    return selectRecommendations(query.data, excluded, artistId);
  }, [query.data, profile.knownTrackIds, excludeTrackIds, artistId]);

  return {
    hasTaste,
    topArtist,
    recommendations,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
