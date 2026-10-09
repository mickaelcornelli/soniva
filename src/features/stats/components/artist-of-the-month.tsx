import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatTotalDuration } from "@/lib/format/duration";
import { routes } from "@/lib/routes";
import type { RankedArtistWithProfile } from "../hooks/use-monthly-stats";

export function ArtistOfTheMonth({ entry }: { entry: RankedArtistWithProfile }) {
  const { artist, seconds, plays } = entry;

  return (
    <section
      aria-labelledby="artiste-du-mois"
      className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-surface p-6 text-center sm:flex-row sm:p-8 sm:text-left"
    >
      <ArtworkImage
        artwork={artist.avatar}
        size="medium"
        alt=""
        className="size-28 shrink-0 rounded-full ring-4 ring-accent/30 sm:size-36"
      />
      <div className="flex min-w-0 flex-col gap-2">
        <h2
          id="artiste-du-mois"
          className="text-sm font-medium tracking-wide text-accent uppercase"
        >
          Ton artiste du mois
        </h2>
        <p className="flex items-center justify-center gap-2 font-display text-3xl font-bold tracking-tight break-words sm:justify-start sm:text-4xl">
          <Link href={routes.artist(artist.handle)} className="hover:underline">
            {artist.name}
          </Link>
          {artist.isVerified ? <VerifiedBadge className="size-6" /> : null}
        </p>
        <p className="text-muted">
          {formatTotalDuration(seconds)} d&apos;écoute · {plays} {plays > 1 ? "écoutes" : "écoute"}
        </p>
      </div>
    </section>
  );
}
