"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { createLibraryRepository } from "./api/library-repository";
import { fetchTracks } from "./api/fetch-tracks";
import { usePlayHistoryRecorder } from "./hooks/use-play-history-recorder";
import { syncLibrary } from "./lib/sync-library";
import { useLibraryStore } from "./store/library-store";

/**
 * Relie la bibliothèque locale au compte : synchronise à la connexion, vide à la
 * déconnexion (pour ne rien laisser sur un appareil partagé), et enregistre les écoutes.
 * Ne rend rien.
 */
export function LibrarySync() {
  const { state } = useAuth();
  const status = state.status;
  const userId = state.user?.id ?? null;

  usePlayHistoryRecorder();

  useEffect(() => {
    void useLibraryStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) {
      // Données d'un compte qui vient de se déconnecter ; celles d'un visiteur sont gardées.
      if (useLibraryStore.getState().ownerId) useLibraryStore.getState().clear();
      return;
    }
    syncLibrary(userId, { repository: createLibraryRepository(userId), fetchTracks }).catch(
      (error: unknown) => console.error("[bibliothèque] synchronisation impossible", error),
    );
  }, [status, userId]);

  return null;
}
