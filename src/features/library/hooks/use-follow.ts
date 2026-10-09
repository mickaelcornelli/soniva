"use client";

import type { Artist } from "@/types/music";
import { createLibraryRepository } from "../api/library-repository";
import { selectIsFollowing, useLibraryStore } from "../store/library-store";

/**
 * Suivi d'un artiste, avec mise à jour optimiste (comme les favoris) : le bouton change
 * tout de suite, puis le compte est mis à jour ; en cas d'échec, l'action est annulée.
 */
export function useFollow(artist: Artist) {
  const isFollowing = useLibraryStore(selectIsFollowing(artist.id));

  async function toggle() {
    const store = useLibraryStore.getState();
    const repository = store.ownerId ? createLibraryRepository(store.ownerId) : null;

    if (isFollowing) {
      const removed = store.unfollow(artist.id);
      if (!repository || !removed) return;
      try {
        await repository.removeFollow(artist.id);
      } catch (error) {
        console.error(error);
        useLibraryStore.getState().follow(removed.artist, removed.followedAt);
      }
      return;
    }

    const added = store.follow(artist);
    if (!repository) return;
    try {
      await repository.addFollows([{ artistId: artist.id, followedAt: added.followedAt }]);
    } catch (error) {
      console.error(error);
      useLibraryStore.getState().unfollow(artist.id);
    }
  }

  return { isFollowing, toggle };
}
