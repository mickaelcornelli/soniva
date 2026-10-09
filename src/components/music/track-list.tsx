"use client";

import { usePlayerStore } from "@/features/player/store/player-store";
import type { Track } from "@/types/music";
import { TrackRow } from "./track-row";

interface TrackListProps {
  tracks: readonly Track[];
  labelledBy: string;
  startAt?: number;
  columns?: 1 | 2;
  renderActions?: (track: Track) => React.ReactNode;
}

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
      // Explicit column: an implicit `auto` track grows to
      // the longest truncated title and overflows on mobile.
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
