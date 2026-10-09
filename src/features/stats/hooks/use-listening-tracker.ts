"use client";

import { useEffect } from "react";
import { PLAY_THRESHOLD_SECONDS } from "@/features/library/hooks/use-play-history-recorder";
import { useLibraryStore } from "@/features/library/store/library-store";
import { selectCurrentItem, usePlayerStore } from "@/features/player/store/player-store";
import { useProgressStore } from "@/features/player/store/progress-store";
import type { Track } from "@/types/music";
import { createListeningRepository } from "../api/listening-repository";
import { flushListening } from "../lib/flush-listening";
import { listenedBetween } from "../lib/listening-meter";
import { useListeningStore } from "../store/listening-store";

/** Le temps écouté est enregistré au plus tard toutes les 30 secondes de lecture. */
const SAVE_EVERY_SECONDS = 30;

/**
 * Mesure le temps réellement écouté (les sauts ne comptent pas) et le nombre d'écoutes,
 * puis les enregistre dans le journal du mois. Les écritures sont groupées : à chaque
 * changement de morceau, pause, mise en arrière-plan de la page ou toutes les 30 s.
 */
export function useListeningTracker() {
  useEffect(() => {
    let current: { queueId: string; track: Track } | null = null;
    let lastTime = 0;
    let seconds = 0;
    let plays = 0;
    let playCounted = false;

    function save() {
      if (!current || (plays === 0 && seconds < 1)) return;
      useListeningStore.getState().record(current.track, { plays, seconds: Math.floor(seconds) });
      // La fraction de seconde restante est gardée pour le prochain enregistrement.
      seconds -= Math.floor(seconds);
      plays = 0;

      const ownerId = useLibraryStore.getState().ownerId;
      if (ownerId) {
        flushListening(createListeningRepository()).catch((error: unknown) =>
          console.error("[statistiques] envoi différé", error),
        );
      }
    }

    const stopProgress = useProgressStore.subscribe(({ currentTime }) => {
      const item = selectCurrentItem(usePlayerStore.getState());
      if (!item) return;

      if (item.queueId !== current?.queueId) {
        save();
        current = { queueId: item.queueId, track: item.track };
        lastTime = currentTime;
        seconds = 0;
        playCounted = false;
        return;
      }

      // Retour au début après une écoute complète (répétition du morceau) : nouvelle écoute.
      if (currentTime < 1 && lastTime >= PLAY_THRESHOLD_SECONDS) playCounted = false;

      seconds += listenedBetween(lastTime, currentTime);
      lastTime = currentTime;

      if (!playCounted && currentTime >= PLAY_THRESHOLD_SECONDS) {
        playCounted = true;
        plays += 1;
      }
      if (seconds >= SAVE_EVERY_SECONDS) save();
    });

    const stopPlayer = usePlayerStore.subscribe((state, previous) => {
      if (previous.isPlaying && !state.isPlaying) save();
    });

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") save();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      save();
      stopProgress();
      stopPlayer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
}
