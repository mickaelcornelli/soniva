import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatCompactNumber } from "@/lib/format/number";
import { routes } from "@/lib/routes";
import type { Artist, ArtistProfile } from "@/types/music";

type ArtistCardData = Artist & Partial<Pick<ArtistProfile, "followerCount">>;

export function ArtistCard({ artist }: { artist: ArtistCardData }) {
  return (
    <article className="group relative flex flex-col items-center gap-3 text-center">
      <ArtworkImage
        artwork={artist.avatar}
        size="medium"
        sizes="9rem"
        alt=""
        className="aspect-square w-full max-w-36 rounded-full transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
      />
      <div className="flex max-w-full min-w-0 flex-col items-center">
        <h3 className="flex max-w-full items-center gap-1 font-medium">
          <Link
            href={routes.artist(artist.handle)}
            className="truncate after:absolute after:inset-0"
          >
            {artist.name}
          </Link>
          {artist.isVerified ? <VerifiedBadge className="size-3.5" /> : null}
        </h3>
        {artist.followerCount === undefined ? null : (
          <p className="text-sm text-muted">
            {formatCompactNumber(artist.followerCount)}{" "}
            {artist.followerCount < 2 ? "abonné" : "abonnés"}
          </p>
        )}
      </div>
    </article>
  );
}
