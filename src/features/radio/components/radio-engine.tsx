"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useLibraryStore } from "@/features/library/store/library-store";
import { selectCurrentItem, usePlayerStore } from "@/features/player/store/player-store";
import { fetchRadioTracks } from "../api/fetch-radio-tracks";
import { pickRadioTracks, shouldExtendQueue } from "../lib/radio-queue";

/** Morceaux ajoutés à chaque relance. */
const RADIO_BATCH_SIZE = 10;
/** Écoutes récentes à ne pas reproposer tout de suite. */
const RECENT_PLAYS_EXCLUDED = 30;
/** Aligné sur le cache CDN de /api/radio. */
const RADIO_STALE_TIME_MS = 10 * 60 * 1000;

/**
 * Prolonge la file d'attente quand elle touche à sa fin, à partir du morceau en cours.
 * Composant sans rendu, monté une fois à côté du moteur audio.
 */
export function RadioEngine() {
  const queryClient = useQueryClient();
  const current = usePlayerStore(selectCurrentItem);
  const radio = usePlayerStore((s) => s.radio);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const repeat = usePlayerStore((s) => s.repeat);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  // Une seule relance par entrée de file : évite de redemander si rien de neuf n'est trouvé.
  const lastSeedRef = useRef<string | null>(null);

  useEffect(() => {
    // Radio coupée puis rallumée : le morceau en cours doit pouvoir relancer la recherche.
    if (!radio) lastSeedRef.current = null;
    // Rien à faire tant que rien ne joue (ex. file restaurée au chargement de la page).
    if (!current || !isPlaying) return;
    if (!shouldExtendQueue({ radio, repeat, queueLength, currentIndex })) return;
    if (lastSeedRef.current === current.queueId) return;
    lastSeedRef.current = current.queueId;

    const seed = { artistId: current.track.artist.id, genre: current.track.genre };
    queryClient
      .fetchQuery({
        queryKey: ["radio", seed.artistId, seed.genre],
        queryFn: ({ signal }) => fetchRadioTracks(seed, signal),
        staleTime: RADIO_STALE_TIME_MS,
      })
      .then((candidates) => {
        const player = usePlayerStore.getState();
        // L'utilisateur a pu couper la radio pendant la requête.
        if (!player.radio) return;
        const recentPlays = useLibraryStore
          .getState()
          .history.slice(0, RECENT_PLAYS_EXCLUDED)
          .map((play) => play.track.id);
        const excluded = new Set([...player.queue.map((item) => item.track.id), ...recentPlays]);
        player.extendQueue(pickRadioTracks(candidates, excluded, RADIO_BATCH_SIZE));
      })
      .catch((error: unknown) => console.error("[radio] impossible de prolonger la file", error));
  }, [current, isPlaying, radio, repeat, queueLength, currentIndex, queryClient]);

  return null;
}
