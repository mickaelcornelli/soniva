import Link from "next/link";
import type { Genre } from "@/lib/genres";
import { routes } from "@/lib/routes";

export function GenrePills({
  genres,
  labelledBy,
}: {
  genres: readonly Genre[];
  labelledBy: string;
}) {
  return (
    <ul aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <li key={genre.slug}>
          <Link
            href={routes.genre(genre.slug)}
            className="inline-flex rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            {genre.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
