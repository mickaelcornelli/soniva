import { ArtworkImage } from "@/components/ui/artwork-image";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatDuration } from "@/lib/format/duration";
import type { Track } from "@/types/music";

interface TrendingRowProps {
  track: Track;
  rank: number;
}

export function TrendingRow({ track, rank }: TrendingRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl px-2 py-2">
      <span
        aria-hidden="true"
        className="w-7 shrink-0 text-right font-display text-sm font-semibold text-muted tabular-nums"
      >
        {rank}
      </span>
      <ArtworkImage
        artwork={track.artwork}
        size="small"
        alt=""
        className="size-12 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{track.title}</span>
        <span className="flex items-center gap-1 text-sm text-muted">
          <span className="truncate">{track.artist.name}</span>
          {track.artist.isVerified ? <VerifiedBadge className="size-3.5" /> : null}
        </span>
      </div>
      <span className="hidden shrink-0 text-sm text-muted sm:block">{track.genre}</span>
      <span className="w-12 shrink-0 text-right text-sm text-muted tabular-nums">
        {formatDuration(track.durationSeconds)}
      </span>
    </div>
  );
}
