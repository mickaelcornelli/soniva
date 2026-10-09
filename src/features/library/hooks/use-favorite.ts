"use client";

import type { Track } from "@/types/music";
import { createLibraryRepository } from "../api/library-repository";
import { selectIsFavorite, useLibraryStore } from "../store/library-store";

/**
 * Optimistic update: the heart toggles immediately, then
 * the account is updated and rolled back on failure.
 */
export function useFavorite(track: Track) {
  const isFavorite = useLibraryStore(selectIsFavorite(track.id));

  async function toggle() {
    const store = useLibraryStore.getState();
    // Signed in = the store belongs to an account (set by the sync).
    const repository = store.ownerId ? createLibraryRepository(store.ownerId) : null;

    if (isFavorite) {
      const removed = store.removeFavorite(track.id);
      if (!repository || !removed) return;
      try {
        await repository.removeFavorite(track.id);
      } catch (error) {
        console.error(error);
        useLibraryStore.getState().addFavorite(removed.track, removed.addedAt);
      }
      return;
    }

    const added = store.addFavorite(track);
    if (!repository) return;
    try {
      await repository.addFavorites([{ trackId: track.id, addedAt: added.addedAt }]);
    } catch (error) {
      console.error(error);
      useLibraryStore.getState().removeFavorite(track.id);
    }
  }

  return { isFavorite, toggle };
}
