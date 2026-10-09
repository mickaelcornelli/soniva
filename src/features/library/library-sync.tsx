"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { createListeningRepository } from "@/features/stats/api/listening-repository";
import { useListeningTracker } from "@/features/stats/hooks/use-listening-tracker";
import { flushListening } from "@/features/stats/lib/flush-listening";
import { useListeningStore } from "@/features/stats/store/listening-store";
import { createLibraryRepository } from "./api/library-repository";
import { fetchArtists } from "./api/fetch-artists";
import { fetchTracks } from "./api/fetch-tracks";
import { usePlayHistoryRecorder } from "./hooks/use-play-history-recorder";
import { syncLibrary } from "./lib/sync-library";
import { useLibraryStore } from "./store/library-store";

/**
 * Syncs on sign-in, clears on sign-out (nothing left on
 * a shared device) and records plays. Renders nothing.
 */
export function LibrarySync() {
  const { state } = useAuth();
  const status = state.status;
  const userId = state.user?.id ?? null;

  usePlayHistoryRecorder();
  useListeningTracker();

  useEffect(() => {
    void useLibraryStore.persist.rehydrate();
    void useListeningStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) {
      // Data of an account that just signed out; a visitor's data is kept.
      if (useLibraryStore.getState().ownerId) {
        useLibraryStore.getState().clear();
        useListeningStore.getState().clear();
      }
      return;
    }
    // Plays left on this device by another account are never attributed to this one.
    const previousOwner = useLibraryStore.getState().ownerId;
    if (previousOwner && previousOwner !== userId) useListeningStore.getState().clear();

    syncLibrary(userId, {
      repository: createLibraryRepository(userId),
      fetchTracks,
      fetchArtists,
    })
      // Plays made signed out or offline are added to the account stats.
      .then(() => flushListening(createListeningRepository()))
      .catch((error: unknown) => console.error("[bibliothèque] synchronisation impossible", error));
  }, [status, userId]);

  return null;
}
