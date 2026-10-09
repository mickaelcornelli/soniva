import Link from "next/link";
import { ArtistLink } from "@/components/music/artist-link";
import { TrackStats } from "@/components/music/track-stats";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { PlayTracksButton } from "@/features/player/components/play-tracks-button";
import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";

interface TrendingLeaderProps {
  track: Track;
  chart: readonly Track[];
}

export function TrendingLeader({ track, chart }: TrendingLeaderProps) {
  return (
    <article className="relative grid items-end gap-6 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10">
      <Link href={routes.track(track.id)} tabIndex={-1} aria-hidden="true">
        <ArtworkImage
          artwork={track.artwork}
          size="large"
          alt=""
          priority
          sizes="18rem"
          className="aspect-square w-full max-w-72 rounded-2xl shadow-[0_30px_80px_-30px] shadow-black"
        />
      </Link>

      <div className="flex min-w-0 flex-col gap-4">
        <p className="flex items-baseline gap-3 text-muted">
          <span className="sr-only">Numéro</span>
          <span className="font-display text-6xl leading-none font-black text-accent sm:text-8xl">
            1
          </span>
          du classement
        </p>

        <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance break-words sm:text-5xl">
          <Link href={routes.track(track.id)} className="underline-offset-8 hover:underline">
            {track.title}
          </Link>
        </h2>

        <ArtistLink artist={track.artist} className="text-lg" />
        <TrackStats track={track} />
        <PlayTracksButton tracks={chart} label="Écouter le classement" />
      </div>
    </article>
  );
}
