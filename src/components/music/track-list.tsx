"use client";

import { usePlayerStore } from "@/features/player/store/player-store";
import type { Track } from "@/types/music";
import { TrackRow } from "./track-row";

interface TrackListProps {
  tracks: readonly Track[];
  /** Id du titre qui nomme la liste, pour les lecteurs d'écran. */
  labelledBy: string;
  /** Numéro du premier morceau (2 pour la suite d'un classement, par exemple). */
  startAt?: number;
  columns?: 1 | 2;
  /** Actions propres au contexte, affichées sur chaque ligne (ex. « retirer de la playlist »). */
  renderActions?: (track: Track) => React.ReactNode;
}

/** Liste numérotée de morceaux ; lire un morceau met toute la liste en file d'attente. */
export function TrackList({
  tracks,
  labelledBy,
  startAt = 1,
  columns = 1,
  renderActions,
}: TrackListProps) {
  return (
    <ol
      start={startAt}
      aria-labelledby={labelledBy}
      // grid-cols-1 (minmax(0, 1fr)) : sans colonne explicite, la grille s'élargirait jusqu'au
      // titre le plus long, que `truncate` empêche de couper, et la page déborderait sur mobile.
      className={`grid grid-cols-1 gap-x-8 gap-y-1 ${columns === 2 ? "lg:grid-cols-2" : ""}`}
    >
      {tracks.map((track, index) => (
        <li key={track.id}>
          <TrackRow
            track={track}
            position={startAt + index}
            onPlay={() => usePlayerStore.getState().playTracks(tracks, index)}
            actions={renderActions?.(track)}
          />
        </li>
      ))}
    </ol>
  );
}
