"use client";

import { useEffect } from "react";
import { selectCurrentItem, usePlayerStore } from "@/features/player/store/player-store";
import { useProgressStore } from "@/features/player/store/progress-store";
import { createLibraryRepository } from "../api/library-repository";
import { useLibraryStore } from "../store/library-store";

/** Une écoute ne compte qu'après ce temps : un morceau zappé n'encombre pas l'historique. */
const PLAY_THRESHOLD_SECONDS = 15;

/** Ajoute à l'historique chaque morceau écouté au-delà du seuil, une fois par entrée de file. */
export function usePlayHistoryRecorder() {
  useEffect(() => {
    let recordedQueueId: string | null = null;

    return useProgressStore.subscribe(({ currentTime }) => {
      if (currentTime < PLAY_THRESHOLD_SECONDS) return;
      const item = selectCurrentItem(usePlayerStore.getState());
      if (!item || item.queueId === recordedQueueId) return;
      recordedQueueId = item.queueId;

      const library = useLibraryStore.getState();
      const play = library.recordPlay(item.track);
      if (!library.ownerId) return;

      // Échec réseau : l'écoute reste marquée non synchronisée et partira à la prochaine connexion.
      createLibraryRepository(library.ownerId)
        .addPlays([{ trackId: play.track.id, playedAt: play.playedAt }])
        .then(() => useLibraryStore.getState().markPlaysSynced([play.id]))
        .catch((error: unknown) => console.error(error));
    });
  }, []);
}
