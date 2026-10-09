"use client";

import { useEffect } from "react";
import { selectCurrentItem, usePlayerStore } from "@/features/player/store/player-store";
import { useProgressStore } from "@/features/player/store/progress-store";
import { createLibraryRepository } from "../api/library-repository";
import { useLibraryStore } from "../store/library-store";

/** A play only counts after this delay, so skipped tracks don't clutter the history. */
export const PLAY_THRESHOLD_SECONDS = 15;

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

      // Network failure: the play stays unsynced and is sent on the next sign-in.
      createLibraryRepository(library.ownerId)
        .addPlays([{ trackId: play.track.id, playedAt: play.playedAt }])
        .then(() => useLibraryStore.getState().markPlaysSynced([play.id]))
        .catch((error: unknown) => console.error(error));
    });
  }, []);
}
