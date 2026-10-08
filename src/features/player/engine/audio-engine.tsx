"use client";

import { useEffect, useRef } from "react";
import { routes } from "@/lib/routes";
import { selectCurrentItem, usePlayerStore } from "../store/player-store";
import { useProgressStore } from "../store/progress-store";
import { useMediaSession } from "./use-media-session";

/**
 * Seul composant qui manipule l'élément <audio>. Il aligne le lecteur réel sur
 * l'état du store (morceau, lecture, volume, position) et remonte les événements
 * audio au store. Monté une seule fois, dans le layout, pour survivre aux navigations.
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

  // Nouveau morceau : on change la source. Dépend de l'entrée de file (queueId)
  // pour qu'un même morceau présent deux fois soit bien rechargé.
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
      // AbortError : la source a changé pendant le chargement, rien d'anormal.
      if (error instanceof DOMException && error.name === "AbortError") return;
      // NotAllowedError : lecture automatique bloquée tant que l'utilisateur n'a pas interagi.
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

  // preload="none" : rien n'est téléchargé avant que l'utilisateur lance la lecture.
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
