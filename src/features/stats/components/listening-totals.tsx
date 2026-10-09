import type { MonthSummary } from "../lib/summarize-month";

const integerFormatter = new Intl.NumberFormat("fr-FR");

/** Chiffre clé du mois (minutes écoutées) et compteurs secondaires. */
export function ListeningTotals({ summary }: { summary: MonthSummary }) {
  const minutes = Math.round(summary.totalSeconds / 60);
  const counters = [
    { value: summary.totalPlays, label: summary.totalPlays > 1 ? "écoutes" : "écoute" },
    { value: summary.trackCount, label: summary.trackCount > 1 ? "morceaux" : "morceau" },
    { value: summary.artistCount, label: summary.artistCount > 1 ? "artistes" : "artiste" },
  ];

  return (
    <section
      aria-label="Totaux du mois"
      className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-10"
    >
      {/* Halo décoratif, dans l'esprit d'un vumètre allumé. */}
      <span
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <p className="flex flex-col gap-1">
          <span className="font-display text-6xl leading-none font-bold tracking-tight text-accent tabular-nums sm:text-8xl">
            {integerFormatter.format(minutes)}
          </span>
          <span className="text-lg text-muted">
            {minutes > 1 ? "minutes d'écoute" : "minute d'écoute"}
          </span>
        </p>
        <dl className="grid grid-cols-3 gap-3 sm:gap-4">
          {counters.map(({ label, value }) => (
            <div
              key={label}
              className="flex min-w-24 flex-col gap-1 rounded-2xl border border-line bg-night/40 px-4 py-3"
            >
              <dt className="order-2 text-sm text-muted">{label}</dt>
              <dd className="order-1 font-display text-2xl font-semibold tabular-nums">
                {integerFormatter.format(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
