"use client";

import { useEffect, useRef } from "react";
import { routes } from "@/lib/routes";
import { selectCurrentItem, usePlayerStore } from "../store/player-store";
import { useProgressStore } from "../store/progress-store";
import { useMediaSession } from "./use-media-session";

/**
 * The only component touching the <audio> element: syncs it with the store and
 * reports audio events back. Mounted once in the layout to survive navigation.
 */
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = usePlayerStore(selectCurrentItem);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const pendingSeek = usePlayerStore((s) => s.pendingSeek);

  const queueId = current?.queueId;
  const trackId = current?.track.id;

  useMediaSession(current?.track, isPlaying);

  useEffect(() => {
    void usePlayerStore.persist.rehydrate();
  }, []);

  // Keyed on the queue entry so the same track queued twice is reloaded.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!trackId) {
      audio.removeAttribute("src");
      audio.load();
      return;
    }
    audio.src = routes.stream(trackId);
  }, [queueId, trackId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !queueId) return;
    if (!isPlaying) {
      audio.pause();
      return;
    }
    audio.play().catch((error: unknown) => {
      // AbortError: the source changed while loading, nothing wrong.
      if (error instanceof DOMException && error.name === "AbortError") return;
      // NotAllowedError: autoplay blocked until the user interacts.
      usePlayerStore.getState().setPlaying(false);
    });
  }, [isPlaying, queueId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || pendingSeek === null) return;
    audio.currentTime = pendingSeek;
    usePlayerStore.getState().clearPendingSeek();
  }, [pendingSeek]);

  const progress = useProgressStore.getState;

  // Nothing is downloaded before the user presses play.
  return (
    <audio
      ref={audioRef}
      preload="none"
      onTimeUpdate={(event) => progress().setCurrentTime(event.currentTarget.currentTime)}
      onDurationChange={(event) => progress().setDuration(event.currentTarget.duration)}
      onWaiting={() => progress().setBuffering(true)}
      onPlaying={() => progress().setBuffering(false)}
      onEnded={() => usePlayerStore.getState().handleEnded()}
      onError={() => {
        progress().setBuffering(false);
        usePlayerStore.getState().handleError("Ce morceau ne peut pas être lu pour le moment.");
      }}
    />
  );
}
