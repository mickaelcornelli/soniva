import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Artist, Track } from "@/types/music";
import { DEVICE_STORAGE_KEYS } from "@/lib/device-storage";
import {
  type FavoriteEntry,
  type FollowEntry,
  HISTORY_SIZE,
  type HistoryEntry,
} from "../lib/library-sync-plan";

/**
 * Works without an account; once signed in it acts as a local cache of the account
 * (instant display, fewer requests) and changes are also sent to Supabase.
 */
export interface LibraryState {
  /** Null for a visitor. */
  ownerId: string | null;
  favorites: FavoriteEntry[];
  history: HistoryEntry[];
  follows: FollowEntry[];
}

export interface LibraryActions {
  addFavorite: (track: Track, addedAt?: string) => FavoriteEntry;
  /** Returns the removed entry so the action can be undone. */
  removeFavorite: (trackId: string) => FavoriteEntry | undefined;
  recordPlay: (track: Track, playedAt?: string) => HistoryEntry;
  markPlaysSynced: (ids: readonly string[]) => void;
  follow: (artist: Artist, followedAt?: string) => FollowEntry;
  /** Returns the removed entry so the action can be undone. */
  unfollow: (artistId: string) => FollowEntry | undefined;
  replace: (state: LibraryState) => void;
  clear: () => void;
}

export type LibraryStore = LibraryState & LibraryActions;

const emptyState: LibraryState = { ownerId: null, favorites: [], history: [], follows: [] };

const byNewest = (a: FavoriteEntry, b: FavoriteEntry) => b.addedAt.localeCompare(a.addedAt);

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      ...emptyState,

      addFavorite(track, addedAt = new Date().toISOString()) {
        const entry = { track, addedAt };
        const others = get().favorites.filter((favorite) => favorite.track.id !== track.id);
        set({ favorites: [...others, entry].sort(byNewest) });
        return entry;
      },

      removeFavorite(trackId) {
        const { favorites } = get();
        const removed = favorites.find((favorite) => favorite.track.id === trackId);
        if (removed) set({ favorites: favorites.filter((favorite) => favorite !== removed) });
        return removed;
      },

      recordPlay(track, playedAt = new Date().toISOString()) {
        const entry: HistoryEntry = {
          id: `${track.id}@${playedAt}`,
          track,
          playedAt,
          synced: false,
        };
        const others = get().history.filter((play) => play.track.id !== track.id);
        set({ history: [entry, ...others].slice(0, HISTORY_SIZE) });
        return entry;
      },

      markPlaysSynced(ids) {
        const synced = new Set(ids);
        set({
          history: get().history.map((play) =>
            synced.has(play.id) ? { ...play, synced: true } : play,
          ),
        });
      },

      follow(artist, followedAt = new Date().toISOString()) {
        // Keep only `Artist` fields: a full profile would bloat storage.
        const { id, name, handle, isVerified, avatar } = artist;
        const entry = { artist: { id, name, handle, isVerified, avatar }, followedAt };
        const others = get().follows.filter((follow) => follow.artist.id !== artist.id);
        set({
          follows: [...others, entry].sort((a, b) => b.followedAt.localeCompare(a.followedAt)),
        });
        return entry;
      },

      unfollow(artistId) {
        const { follows } = get();
        const removed = follows.find((follow) => follow.artist.id === artistId);
        if (removed) set({ follows: follows.filter((follow) => follow !== removed) });
        return removed;
      },

      replace(state) {
        set(state);
      },

      clear() {
        set(emptyState);
      },
    }),
    {
      name: DEVICE_STORAGE_KEYS.library,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Manual rehydration after mount (same reason as the player store).
      skipHydration: true,
      partialize: ({ ownerId, favorites, history, follows }) => ({
        ownerId,
        favorites,
        history,
        follows,
      }),
    },
  ),
);

export const selectIsFollowing = (artistId: string) => (state: LibraryStore) =>
  state.follows.some((follow) => follow.artist.id === artistId);

export const selectIsFavorite = (trackId: string) => (state: LibraryStore) =>
  state.favorites.some((favorite) => favorite.track.id === trackId);
