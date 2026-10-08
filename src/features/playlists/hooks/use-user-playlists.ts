"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTracks } from "@/features/library/api/fetch-tracks";
import { useLibraryStore } from "@/features/library/store/library-store";
import { createPlaylistsRepository } from "../api/playlists-repository";
import type { UserPlaylistWithTracks } from "../types";

/** Compte connecté (fixé par la synchronisation de la bibliothèque), ou null pour un visiteur. */
export function useAccountId(): string | null {
  return useLibraryStore((state) => state.ownerId);
}

const playlistKeys = {
  all: (userId: string) => ["user-playlists", userId] as const,
  detail: (userId: string, id: string) => ["user-playlists", userId, id] as const,
};

function requireUser(userId: string | null): string {
  if (!userId) throw new Error("Connexion requise pour gérer des playlists.");
  return userId;
}

export function useUserPlaylists() {
  const userId = useAccountId();
  return useQuery({
    queryKey: playlistKeys.all(userId ?? ""),
    queryFn: () => createPlaylistsRepository(requireUser(userId)).list(),
    enabled: userId !== null,
  });
}

/** Une playlist et ses morceaux (métadonnées récupérées chez le provider musical). */
export function useUserPlaylist(id: string) {
  const userId = useAccountId();
  return useQuery({
    queryKey: playlistKeys.detail(userId ?? "", id),
    enabled: userId !== null,
    queryFn: async (): Promise<UserPlaylistWithTracks | null> => {
      const row = await createPlaylistsRepository(requireUser(userId)).get(id);
      if (!row) return null;
      const { trackIds, ...playlist } = row;
      return { ...playlist, tracks: trackIds.length > 0 ? await fetchTracks(trackIds) : [] };
    },
  });
}

/** Toutes les modifications invalident la liste et les détails du compte. */
export function usePlaylistMutations() {
  const userId = useAccountId();
  const queryClient = useQueryClient();
  const repository = () => createPlaylistsRepository(requireUser(userId));
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: playlistKeys.all(userId ?? "") });

  return {
    create: useMutation({
      mutationFn: (name: string) => repository().create(name),
      onSuccess: invalidate,
    }),
    rename: useMutation({
      mutationFn: ({ id, name }: { id: string; name: string }) => repository().update(id, { name }),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => repository().remove(id),
      onSuccess: invalidate,
    }),
    addTrack: useMutation({
      mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
        repository().addTrack(playlistId, trackId),
      onSuccess: invalidate,
    }),
    removeTrack: useMutation({
      mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
        repository().removeTrack(playlistId, trackId),
      onSuccess: invalidate,
    }),
  };
}
