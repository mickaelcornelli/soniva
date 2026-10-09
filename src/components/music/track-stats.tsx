import Link from "next/link";
import { formatLongDate } from "@/lib/format/date";
import { formatDuration } from "@/lib/format/duration";
import { formatCompactNumber } from "@/lib/format/number";
import { findGenreByName } from "@/lib/genres";
import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";

interface Stat {
  label: string;
  value: string | null;
  numeric?: boolean;
  href?: string | undefined;
}

interface TrackStatsProps {
  track: Track;
  detailed?: boolean;
}

export function TrackStats({ track, detailed = false }: TrackStatsProps) {
  const genre = findGenreByName(track.genre);
  const stats: Stat[] = [
    { label: "Écoutes", value: formatCompactNumber(track.playCount), numeric: true },
    {
      label: "Favoris",
      value: detailed ? formatCompactNumber(track.favoriteCount) : null,
      numeric: true,
    },
    { label: "Durée", value: formatDuration(track.durationSeconds), numeric: true },
    {
      label: "Genre",
      value: genre?.label ?? track.genre,
      href: genre ? routes.genre(genre.slug) : undefined,
    },
    { label: "Ambiance", value: detailed ? track.mood : null },
    { label: "Sortie", value: detailed ? formatLongDate(track.releaseDate) : null },
  ];

  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
      {stats.map(({ label, value, numeric, href }) =>
        value ? (
          <div key={label} className="flex gap-1.5">
            <dt>{label}</dt>
            <dd className={`font-medium text-foreground ${numeric ? "tabular-nums" : ""}`}>
              {href ? (
                <Link href={href} className="underline-offset-4 hover:text-accent hover:underline">
                  {value}
                </Link>
              ) : (
                value
              )}
            </dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}
