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
 * Relie la bibliothèque locale au compte : synchronise à la connexion, vide à la
 * déconnexion (pour ne rien laisser sur un appareil partagé), et enregistre les écoutes.
 * Ne rend rien.
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
      // Données d'un compte qui vient de se déconnecter ; celles d'un visiteur sont gardées.
      if (useLibraryStore.getState().ownerId) {
        useLibraryStore.getState().clear();
        useListeningStore.getState().clear();
      }
      return;
    }
    // Écoutes laissées par un autre compte sur cet appareil : jamais attribuées à celui-ci.
    const previousOwner = useLibraryStore.getState().ownerId;
    if (previousOwner && previousOwner !== userId) useListeningStore.getState().clear();

    syncLibrary(userId, {
      repository: createLibraryRepository(userId),
      fetchTracks,
      fetchArtists,
    })
      // Écoutes faites sans compte ou hors ligne : ajoutées aux statistiques du compte.
      .then(() => flushListening(createListeningRepository()))
      .catch((error: unknown) => console.error("[bibliothèque] synchronisation impossible", error));
  }, [status, userId]);

  return null;
}
