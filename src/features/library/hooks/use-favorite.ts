"use client";

import type { Track } from "@/types/music";
import { createLibraryRepository } from "../api/library-repository";
import { selectIsFavorite, useLibraryStore } from "../store/library-store";

/**
 * Favori d'un morceau, avec mise à jour optimiste : le cœur change tout de suite,
 * puis le compte est mis à jour ; en cas d'échec, l'action est annulée.
 */
export function useFavorite(track: Track) {
  const isFavorite = useLibraryStore(selectIsFavorite(track.id));

  async function toggle() {
    const store = useLibraryStore.getState();
    // Connecté = le store appartient à un compte (fixé par la synchronisation).
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
