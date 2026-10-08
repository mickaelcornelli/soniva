"use client";

import { useEffect } from "react";
import { pickArtworkUrl } from "@/lib/artwork";
import type { Track } from "@/types/music";
import { usePlayerStore } from "../store/player-store";

/**
 * Expose le morceau en cours au système (écran verrouillé, touches multimédia,
 * casque Bluetooth) via la Media Session API, quand le navigateur la supporte.
 */
export function useMediaSession(track: Track | undefined, isPlaying: boolean) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      return;
    }
    const artwork = pickArtworkUrl(track.artwork, "medium");
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist.name,
      artwork: artwork ? [{ src: artwork, sizes: "480x480" }] : [],
    });
  }, [track]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const { setPlaying, next, previous, seek } = usePlayerStore.getState();
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => setPlaying(true)],
      ["pause", () => setPlaying(false)],
      ["nexttrack", () => next()],
      ["previoustrack", () => previous()],
      ["seekto", (details) => details.seekTime !== undefined && seek(details.seekTime)],
    ];
    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Action non supportée par ce navigateur : on l'ignore.
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Idem.
        }
      }
    };
  }, []);
}
