"use client";

import { selectCurrentItem, usePlayerStore } from "../store/player-store";

export function useCurrentTrack() {
  return usePlayerStore((state) => selectCurrentItem(state)?.track);
}

export function useTrackPlayback(trackId: string): { isPlaying: boolean } | null {
  const isCurrent = usePlayerStore((state) => selectCurrentItem(state)?.track.id === trackId);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  return isCurrent ? { isPlaying } : null;
}
