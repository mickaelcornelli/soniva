import { genreLabel } from "@/lib/genres";
import type { RankedGenre } from "../lib/summarize-month";

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 0,
});

interface GenreBreakdownProps {
  genres: readonly RankedGenre[];
  labelledBy: string;
}

/**
 * Single series: one hue, with the value written next to each bar (never carried by colour alone).
 */
export function GenreBreakdown({ genres, labelledBy }: GenreBreakdownProps) {
  // Relative to the top genre: the longest bar spans the full width.
  const max = Math.max(...genres.map((genre) => genre.share), 0);

  return (
    <ol aria-labelledby={labelledBy} className="flex flex-col gap-4">
      {genres.map(({ genre, share }) => (
        <li key={genre} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="font-medium">{genreLabel(genre)}</span>
            <span className="text-muted tabular-nums">{percentFormatter.format(share)}</span>
          </div>
          <span aria-hidden="true" className="block h-2 rounded-full bg-raised">
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: `${max > 0 ? (share / max) * 100 : 0}%` }}
            />
          </span>
        </li>
      ))}
    </ol>
  );
}
