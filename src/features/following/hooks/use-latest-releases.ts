"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLibraryStore } from "@/features/library/store/library-store";
import { fetchLatestReleases } from "../api/fetch-latest-releases";

/** Doit rester aligné sur la limite de /api/releases. */
const MAX_ARTISTS = 20;
/** Aligné sur le cache CDN de /api/releases. */
const RELEASES_STALE_TIME_MS = 30 * 60 * 1000;

/** Nouveautés des artistes suivis (les 20 suivis le plus récemment). */
export function useLatestReleases() {
  const follows = useLibraryStore((state) => state.follows);

  // Ids triés : la clé de cache ne dépend pas de l'ordre de suivi.
  const artistIds = useMemo(
    () =>
      follows
        .slice(0, MAX_ARTISTS)
        .map((follow) => follow.artist.id)
        .sort(),
    [follows],
  );

  const query = useQuery({
    queryKey: ["releases", artistIds],
    queryFn: ({ signal }) => fetchLatestReleases(artistIds, signal),
    enabled: artistIds.length > 0,
    staleTime: RELEASES_STALE_TIME_MS,
  });

  return { hasFollows: artistIds.length > 0, ...query };
}
