import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { routes } from "@/lib/routes";
import type { Artist } from "@/types/music";

interface ArtistLinkProps {
  artist: Pick<Artist, "name" | "handle" | "isVerified">;
  className?: string;
  badgeClassName?: string;
}

/** `py-0.5` brings the hit area to 24px (WCAG 2.5.8). */
export function ArtistLink({ artist, className = "", badgeClassName }: ArtistLinkProps) {
  return (
    <span className={`flex min-w-0 items-center gap-1.5 ${className}`}>
      <Link
        href={routes.artist(artist.handle)}
        className="truncate py-0.5 underline-offset-4 hover:text-foreground hover:underline"
      >
        {artist.name}
      </Link>
      {artist.isVerified ? <VerifiedBadge className={badgeClassName} /> : null}
    </span>
  );
}
