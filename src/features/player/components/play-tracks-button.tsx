"use client";

import { Pause, Play } from "lucide-react";
import type { Track } from "@/types/music";
import { useTrackPlayback } from "../hooks/use-player";
import { usePlayerStore } from "../store/player-store";

interface PlayTracksButtonProps {
  /** Morceaux mis en file d'attente au clic. */
  tracks: readonly Track[];
  startIndex?: number;
  label?: string;
}

/**
 * Bouton « Lire » d'une page (morceau, artiste, playlist). Si le morceau de départ
 * est déjà en cours, il bascule lecture/pause au lieu de relancer la file.
 */
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
