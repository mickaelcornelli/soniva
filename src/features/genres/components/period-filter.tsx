import Link from "next/link";
import { routes } from "@/lib/routes";
import { TRENDING_PERIODS } from "@/lib/trending-period";
import type { TrendingPeriod } from "@/types/music";

interface PeriodFilterProps {
  genreSlug: string;
  current: TrendingPeriod;
}

/**
 * Links rather than buttons: each period has its own shareable URL and works without JavaScript.
 */
export function PeriodFilter({ genreSlug, current }: PeriodFilterProps) {
  return (
    <nav aria-label="Période du classement">
      <ul className="flex flex-wrap gap-2">
        {TRENDING_PERIODS.map(({ value, label }) => {
          const active = value === current;
          return (
            <li key={value}>
              <Link
                href={routes.genre(genreSlug, value)}
                aria-current={active ? "page" : undefined}
                scroll={false}
                className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-line text-muted hover:border-accent/60 hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
