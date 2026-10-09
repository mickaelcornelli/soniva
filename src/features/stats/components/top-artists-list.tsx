import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { formatTotalDuration } from "@/lib/format/duration";
import { routes } from "@/lib/routes";
import type { RankedArtistWithProfile } from "../hooks/use-monthly-stats";

interface TopArtistsListProps {
  entries: readonly RankedArtistWithProfile[];
  labelledBy: string;
}

export function TopArtistsList({ entries, labelledBy }: TopArtistsListProps) {
  return (
    <ol aria-labelledby={labelledBy} className="flex flex-col gap-1">
      {entries.map(({ artist, seconds }, index) => (
        <li key={artist.id}>
          <Link
            href={routes.artist(artist.handle)}
            className="flex items-center gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-surface"
          >
            <span className="w-5 text-right text-sm text-muted tabular-nums">{index + 1}</span>
            <ArtworkImage
              artwork={artist.avatar}
              size="small"
              alt=""
              className="size-11 shrink-0 rounded-full"
            />
            <span className="min-w-0 flex-1 truncate font-medium">{artist.name}</span>
            <span className="text-sm text-muted tabular-nums">{formatTotalDuration(seconds)}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
