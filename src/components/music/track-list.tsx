import type { Track } from "@/types/music";
import { TrackRow } from "./track-row";

interface TrackListProps {
  tracks: readonly Track[];
  /** Id du titre qui nomme la liste, pour les lecteurs d'écran. */
  labelledBy: string;
  /** Numéro du premier morceau (2 pour la suite d'un classement, par exemple). */
  startAt?: number;
  columns?: 1 | 2;
}

export function TrackList({ tracks, labelledBy, startAt = 1, columns = 1 }: TrackListProps) {
  return (
    <ol
      start={startAt}
      aria-labelledby={labelledBy}
      className={`grid gap-x-8 gap-y-1 ${columns === 2 ? "lg:grid-cols-2" : ""}`}
    >
      {tracks.map((track, index) => (
        <li key={track.id}>
          <TrackRow track={track} position={startAt + index} />
        </li>
      ))}
    </ol>
  );
}
