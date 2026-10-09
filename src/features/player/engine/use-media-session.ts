"use client";

import { useEffect } from "react";
import { pickArtworkUrl } from "@/lib/artwork";
import type { Track } from "@/types/music";
import { usePlayerStore } from "../store/player-store";

/**
 * Lock screen, media keys and Bluetooth headsets, when the browser supports the Media Session API.
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
        // Action not supported by this browser.
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Same as above.
        }
      }
    };
  }, []);
}
