import { MapPin } from "lucide-react";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatCompactNumber } from "@/lib/format/number";
import { pluralize } from "@/lib/format/plural";
import type { ArtistProfile } from "@/types/music";

export function ArtistHero({ artist }: { artist: ArtistProfile }) {
  return (
    <header className="flex flex-col">
      {/* Bannière décorative : l'avatar et le nom portent l'information. */}
      <ArtworkImage
        artwork={artist.cover}
        size="large"
        alt=""
        priority
        className="h-40 w-full rounded-3xl sm:h-64"
      />

      <div className="-mt-12 flex flex-col gap-5 px-2 sm:-mt-16 sm:flex-row sm:items-end sm:gap-8 sm:px-6">
        <ArtworkImage
          artwork={artist.avatar}
          size="medium"
          alt={`Photo de ${artist.name}`}
          className="size-28 shrink-0 rounded-full border-4 border-night sm:size-36"
        />
        <div className="flex min-w-0 flex-col gap-3 pb-1">
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight break-words sm:text-5xl">
            <span className="min-w-0">{artist.name}</span>
            {artist.isVerified ? <VerifiedBadge className="size-6 sm:size-8" /> : null}
          </h1>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <li>@{artist.handle}</li>
            <li>
              <span className="font-medium text-foreground tabular-nums">
                {formatCompactNumber(artist.followerCount)}
              </span>{" "}
              {artist.followerCount < 2 ? "abonné" : "abonnés"}
            </li>
            <li>{pluralize(artist.trackCount, "morceau", "morceaux")}</li>
            {artist.location ? (
              <li className="flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-3.5" />
                {artist.location}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </header>
  );
}
