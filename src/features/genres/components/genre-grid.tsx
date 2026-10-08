import Link from "next/link";
import type { Genre } from "@/lib/genres";
import { routes } from "@/lib/routes";

/** Teinte stable par genre : chaque tuile a sa couleur sans palette à maintenir. */
function hueOf(slug: string): number {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

export function GenreGrid({
  genres,
  labelledBy,
}: {
  genres: readonly Genre[];
  labelledBy: string;
}) {
  return (
    <ul
      aria-labelledby={labelledBy}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {genres.map((genre) => (
        <li key={genre.slug}>
          <Link
            href={routes.genre(genre.slug)}
            style={{ "--hue": hueOf(genre.slug) } as React.CSSProperties}
            className="group relative flex h-24 items-end overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/60 focus-visible:border-accent sm:h-28"
          >
            {/* Halo coloré décoratif, propre à chaque genre. */}
            <span
              aria-hidden="true"
              className="absolute -top-10 -right-10 size-32 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-90 motion-reduce:transition-none"
              style={{ background: "hsl(var(--hue) 75% 60% / 0.35)" }}
            />
            <span className="relative font-display text-base leading-tight font-semibold sm:text-lg">
              {genre.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
