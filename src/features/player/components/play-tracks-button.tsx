"use client";

import { Pause, Play } from "lucide-react";
import type { Track } from "@/types/music";
import { useTrackPlayback } from "../hooks/use-player";
import { usePlayerStore } from "../store/player-store";

interface PlayTracksButtonProps {
  tracks: readonly Track[];
  startIndex?: number;
  label?: string;
}

/** If the first track is already current, toggles play/pause instead of restarting the queue. */
export function PlayTracksButton({
  tracks,
  startIndex = 0,
  label = "Lire",
}: PlayTracksButtonProps) {
  const startTrack = tracks[startIndex];
  const playback = useTrackPlayback(startTrack?.id ?? "");

  if (!startTrack) return null;

  const isPlaying = playback?.isPlaying ?? false;

  function handleClick() {
    const player = usePlayerStore.getState();
    if (playback) player.togglePlay();
    else player.playTracks(tracks, startIndex);
  }

  const Icon = isPlaying ? Pause : Play;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:scale-[1.03] active:scale-95 motion-reduce:transition-none"
    >
      <Icon aria-hidden="true" className="size-5" fill="currentColor" />
      {isPlaying ? "Pause" : label}
    </button>
  );
}
