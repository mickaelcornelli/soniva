"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLibraryStore } from "@/features/library/store/library-store";
import { fetchRecommendations } from "../api/fetch-recommendations";
import { selectRecommendations } from "../lib/select-recommendations";
import { buildTasteProfile } from "../lib/taste-profile";

/** Aligné sur le cache CDN de /api/discover. */
const DISCOVER_STALE_TIME_MS = 10 * 60 * 1000;
/** Référence stable : un `[]` par défaut recalculerait la sélection à chaque rendu. */
const NO_EXCLUSION: readonly string[] = [];

interface UseRecommendationsOptions {
  /** Morceaux déjà affichés sur la page, à ne pas reproposer. */
  excludeTrackIds?: readonly string[];
}

/**
 * Recommandations personnalisées, déduites de la bibliothèque locale. Sans favori ni
 * écoute, aucun appel n'est fait : il n'y a encore rien sur quoi s'appuyer.
 */
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
    // Seuls les genres et l'artiste de référence comptent : une nouvelle écoute qui ne
    // les change pas ne relance pas la requête.
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
