"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLibraryStore } from "@/features/library/store/library-store";
import { fetchLatestReleases } from "../api/fetch-latest-releases";

/** Must match the /api/releases limit. */
const MAX_ARTISTS = 20;
/** Matches the CDN cache of /api/releases. */
const RELEASES_STALE_TIME_MS = 30 * 60 * 1000;

export function useLatestReleases() {
  const follows = useLibraryStore((state) => state.follows);

  // Sorted IDs so the cache key doesn't depend on follow order.
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
