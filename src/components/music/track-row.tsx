import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { formatDuration } from "@/lib/format/duration";
import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";
import { ArtistLink } from "./artist-link";

interface TrackRowProps {
  track: Track;
  /** Position affichée (classement, ordre d'une playlist). */
  position: number;
}

export function TrackRow({ track, position }: TrackRowProps) {
  return (
    // Le lien du titre est étiré sur toute la ligne (after:inset-0) ; le lien artiste
    // passe au-dessus (relative z-10) pour rester cliquable séparément.
    <div className="group relative flex items-center gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-surface">
      <span
        aria-hidden="true"
        className="w-7 shrink-0 text-right font-display text-sm font-semibold text-muted tabular-nums"
      >
        {position}
      </span>
      <ArtworkImage
        artwork={track.artwork}
        size="small"
        alt=""
        className="size-12 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={routes.track(track.id)}
          className="truncate font-medium after:absolute after:inset-0 after:rounded-xl"
        >
          {track.title}
        </Link>
        <ArtistLink
          artist={track.artist}
          className="relative z-10 self-start text-sm text-muted"
          badgeClassName="size-3.5"
        />
      </div>
      <span className="hidden shrink-0 text-sm text-muted sm:block">{track.genre}</span>
      <span className="w-12 shrink-0 text-right text-sm text-muted tabular-nums">
        {formatDuration(track.durationSeconds)}
      </span>
    </div>
  );
}
