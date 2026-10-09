import Link from "next/link";
import { routes } from "@/lib/routes";

export type StatsPeriod = "current" | "previous";

const PERIODS: readonly { value: StatsPeriod; label: string }[] = [
  { value: "current", label: "Ce mois-ci" },
  { value: "previous", label: "Le mois dernier" },
];

export function StatsPeriodSwitch({ current }: { current: StatsPeriod }) {
  return (
    <nav aria-label="Mois affiché">
      <ul className="flex flex-wrap gap-2">
        {PERIODS.map(({ value, label }) => {
          const active = value === current;
          return (
            <li key={value}>
              <Link
                href={routes.libraryStats(value)}
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
