"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { fetchArtists } from "@/features/library/api/fetch-artists";
import { fetchTracks } from "@/features/library/api/fetch-tracks";
import { useLibraryStore } from "@/features/library/store/library-store";
import type { Artist, Track } from "@/types/music";
import { createListeningRepository } from "../api/listening-repository";
import { summarizeMonth } from "../lib/summarize-month";
import { localMonthRows, useListeningStore } from "../store/listening-store";

export interface RankedArtistWithProfile {
  artist: Artist;
  plays: number;
  seconds: number;
}

export interface RankedTrackWithMetadata {
  track: Track;
  plays: number;
  seconds: number;
}

/**
 * Statistiques d'un mois : celles du compte quand l'utilisateur est connecté (tous ses
 * appareils), sinon celles de l'appareil. Les métadonnées des morceaux et artistes du
 * classement viennent d'abord de ce qui est déjà connu localement, le reste du provider.
 */
function storesHydrated(): boolean {
  return useLibraryStore.persist.hasHydrated() && useListeningStore.persist.hasHydrated();
}

/**
 * Les stores locaux sont relus après le montage : tant que ce n'est pas fait, on ne sait
 * pas encore si l'utilisateur est connecté ni ce qu'il a écouté. Sans cette attente, la
 * page afficherait brièvement « aucune écoute ».
 */
function useLocalStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const update = () => setHydrated(storesHydrated());
    update();
    const unsubscribeLibrary = useLibraryStore.persist.onFinishHydration(update);
    const unsubscribeListening = useListeningStore.persist.onFinishHydration(update);
    return () => {
      unsubscribeLibrary();
      unsubscribeListening();
    };
  }, []);

  return hydrated;
}

export function useMonthlyStats(month: string) {
  const hydrated = useLocalStoresHydrated();
  const accountId = useLibraryStore((state) => state.ownerId);
  const favorites = useLibraryStore((state) => state.favorites);
  const history = useLibraryStore((state) => state.history);
  const follows = useLibraryStore((state) => state.follows);
  const months = useListeningStore((state) => state.months);

  const remote = useQuery({
    queryKey: ["listening-stats", accountId, month],
    queryFn: () => createListeningRepository().listMonth(month),
    enabled: hydrated && accountId !== null,
  });

  const localRows = useMemo(() => localMonthRows(months, month), [months, month]);
  const rows = accountId ? remote.data : localRows;
  const summary = useMemo(() => (rows ? summarizeMonth(rows) : undefined), [rows]);

  const known = useMemo(() => {
    const tracks = new Map<string, Track>();
    for (const monthTracks of Object.values(months)) {
      for (const { track } of Object.values(monthTracks)) tracks.set(track.id, track);
    }
    for (const { track } of [...favorites, ...history]) tracks.set(track.id, track);

    const artists = new Map<string, Artist>();
    for (const track of tracks.values()) artists.set(track.artist.id, track.artist);
    for (const { artist } of follows) artists.set(artist.id, artist);
    return { tracks, artists };
  }, [months, favorites, history, follows]);

  const missingTrackIds = (summary?.topTracks ?? [])
    .map((row) => row.trackId)
    .filter((id) => !known.tracks.has(id));
  const missingArtistIds = (summary?.topArtists ?? [])
    .map((row) => row.artistId)
    .filter((id) => !known.artists.has(id));

  const metadata = useQuery({
    queryKey: ["listening-metadata", missingTrackIds, missingArtistIds],
    queryFn: async () => {
      const [tracks, artists] = await Promise.all([
        missingTrackIds.length > 0 ? fetchTracks(missingTrackIds) : Promise.resolve([]),
        missingArtistIds.length > 0 ? fetchArtists(missingArtistIds) : Promise.resolve([]),
      ]);
      return { tracks, artists };
    },
    enabled: missingTrackIds.length + missingArtistIds.length > 0,
    // Noms et pochettes changent rarement : inutile de les redemander pendant la session.
    staleTime: Number.POSITIVE_INFINITY,
  });

  const resolved = useMemo(() => {
    const tracks = new Map(known.tracks);
    const artists = new Map(known.artists);
    for (const track of metadata.data?.tracks ?? []) tracks.set(track.id, track);
    for (const artist of metadata.data?.artists ?? []) artists.set(artist.id, artist);

    // Un morceau ou un artiste retiré du provider disparaît simplement du classement.
    const topTracks: RankedTrackWithMetadata[] = (summary?.topTracks ?? []).flatMap((row) => {
      const track = tracks.get(row.trackId);
      return track ? [{ track, plays: row.plays, seconds: row.seconds }] : [];
    });
    const topArtists: RankedArtistWithProfile[] = (summary?.topArtists ?? []).flatMap((row) => {
      const artist = artists.get(row.artistId);
      return artist ? [{ artist, plays: row.plays, seconds: row.seconds }] : [];
    });
    return { topTracks, topArtists };
  }, [known, metadata.data, summary]);

  return {
    summary,
    ...resolved,
    isLoading: !hydrated || (accountId !== null && remote.isLoading) || metadata.isLoading,
    isError: remote.isError,
    retry: () => void remote.refetch(),
  };
}
