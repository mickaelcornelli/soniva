import { ArtworkImage } from "@/components/ui/artwork-image";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatDuration } from "@/lib/format/duration";
import { formatCompactNumber } from "@/lib/format/number";
import type { Track } from "@/types/music";

/** Le n°1 du classement, mis en scène comme la pochette d'un single. */
export function TrendingLeader({ track }: { track: Track }) {
  return (
    <article className="relative grid items-end gap-6 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10">
      <ArtworkImage
        artwork={track.artwork}
        size="large"
        alt={`Pochette de ${track.title}`}
        priority
        className="aspect-square w-full max-w-72 rounded-2xl shadow-[0_30px_80px_-30px] shadow-black"
      />

      <div className="flex min-w-0 flex-col gap-4">
        <p className="flex items-baseline gap-3 text-muted">
          <span className="sr-only">Numéro</span>
          <span className="font-display text-6xl leading-none font-black text-accent sm:text-8xl">
            1
          </span>
          du classement
        </p>

        <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance break-words sm:text-5xl">
          {track.title}
        </h2>

        <p className="flex items-center gap-2 text-lg">
          <span className="truncate">{track.artist.name}</span>
          {track.artist.isVerified ? <VerifiedBadge /> : null}
        </p>

        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          <div className="flex gap-1.5">
            <dt>Écoutes</dt>
            <dd className="font-medium text-foreground tabular-nums">
              {formatCompactNumber(track.playCount)}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Durée</dt>
            <dd className="font-medium text-foreground tabular-nums">
              {formatDuration(track.durationSeconds)}
            </dd>
          </div>
          {track.genre ? (
            <div className="flex gap-1.5">
              <dt>Genre</dt>
              <dd className="font-medium text-foreground">{track.genre}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}
