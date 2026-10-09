"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useLibraryStore } from "@/features/library/store/library-store";
import { selectCurrentItem, usePlayerStore } from "@/features/player/store/player-store";
import { fetchRadioTracks } from "../api/fetch-radio-tracks";
import { pickRadioTracks, shouldExtendQueue } from "../lib/radio-queue";

const RADIO_BATCH_SIZE = 10;
/** Recent plays not to suggest again right away. */
const RECENT_PLAYS_EXCLUDED = 30;
/** Matches the CDN cache of /api/radio. */
const RADIO_STALE_TIME_MS = 10 * 60 * 1000;

/**
 * Extends the queue as it runs out, based on the current
 * track. Renderless, mounted once next to the audio engine.
 */
export function RadioEngine() {
  const queryClient = useQueryClient();
  const current = usePlayerStore(selectCurrentItem);
  const radio = usePlayerStore((s) => s.radio);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const repeat = usePlayerStore((s) => s.repeat);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  // One refill per queue entry, so we don't ask again when nothing new was found.
  const lastSeedRef = useRef<string | null>(null);

  useEffect(() => {
    // Radio turned off then on: the current track must be able to trigger a new search.
    if (!radio) lastSeedRef.current = null;
    // Nothing to do until something plays (e.g. queue restored on page load).
    if (!current || !isPlaying) return;
    if (!shouldExtendQueue({ radio, repeat, queueLength, currentIndex })) return;
    if (lastSeedRef.current === current.queueId) return;
    lastSeedRef.current = current.queueId;

    const seed = { artistId: current.track.artist.id, genre: current.track.genre };
    queryClient
      .fetchQuery({
        queryKey: ["radio", seed.artistId, seed.genre],
        queryFn: ({ signal }) => fetchRadioTracks(seed, signal),
        staleTime: RADIO_STALE_TIME_MS,
      })
      .then((candidates) => {
        const player = usePlayerStore.getState();
        // The user may have turned the radio off during the request.
        if (!player.radio) return;
        const recentPlays = useLibraryStore
          .getState()
          .history.slice(0, RECENT_PLAYS_EXCLUDED)
          .map((play) => play.track.id);
        const excluded = new Set([...player.queue.map((item) => item.track.id), ...recentPlays]);
        player.extendQueue(pickRadioTracks(candidates, excluded, RADIO_BATCH_SIZE));
      })
      .catch((error: unknown) => console.error("[radio] impossible de prolonger la file", error));
  }, [current, isPlaying, radio, repeat, queueLength, currentIndex, queryClient]);

  return null;
}
