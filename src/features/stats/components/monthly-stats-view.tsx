"use client";

import { BarChart3, WifiOff } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { TrackList } from "@/components/music/track-list";
import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTotalDuration } from "@/lib/format/duration";
import { routes } from "@/lib/routes";
import { useMonthlyStats } from "../hooks/use-monthly-stats";
import { formatMonth, previousMonthKey, toMonthKey } from "../lib/month";
import { ArtistOfTheMonth } from "./artist-of-the-month";
import { GenreBreakdown } from "./genre-breakdown";
import { ListeningTotals } from "./listening-totals";
import { type StatsPeriod, StatsPeriodSwitch } from "./stats-period-switch";
import { TopArtistsList } from "./top-artists-list";

const SECTION_TITLE = "font-display text-xl font-semibold";

export function MonthlyStatsView({ period }: { period: StatsPeriod }) {
  // Le mois est celui de l'utilisateur (son fuseau), d'où un calcul côté navigateur.
  const month = useMemo(() => {
    const current = toMonthKey(new Date());
    return period === "previous" ? previousMonthKey(current) : current;
  }, [period]);
  const { summary, topTracks, topArtists, isLoading, isError, retry } = useMonthlyStats(month);
  const label = formatMonth(month);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            <Link href={routes.library} className="hover:text-foreground hover:underline">
              Bibliothèque
            </Link>
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Ton mois en musique
          </h1>
          {/* Le mois dépend du fuseau de l'utilisateur : il peut différer de celui du serveur. */}
          <p suppressHydrationWarning className="text-lg text-muted first-letter:uppercase">
            {label}
          </p>
        </div>
        <StatsPeriodSwitch current={period} />
      </header>

      {isError ? (
        <EmptyState
          icon={WifiOff}
          title="Statistiques indisponibles"
          description="Impossible de lire tes écoutes pour le moment. Réessaie dans un instant."
          action={
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground"
            >
              Réessayer
            </button>
          }
        />
      ) : isLoading || !summary ? (
        <StatsSkeleton />
      ) : summary.totalSeconds < 60 ? (
        <EmptyState
          icon={BarChart3}
          title={`Pas encore d'écoute en ${label}`}
          description="Lance quelques morceaux : tes minutes d'écoute, tes artistes et tes genres préférés du mois apparaîtront ici."
        />
      ) : (
        <>
          <ListeningTotals summary={summary} />

          {topArtists[0] ? <ArtistOfTheMonth entry={topArtists[0]} /> : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {topTracks.length > 0 ? (
              <section aria-labelledby="top-morceaux" className="flex flex-col gap-4">
                <h2 id="top-morceaux" className={SECTION_TITLE}>
                  Tes morceaux du mois
                </h2>
                <TrackList
                  tracks={topTracks.map(({ track }) => track)}
                  labelledBy="top-morceaux"
                  renderActions={(track) => {
                    const entry = topTracks.find((item) => item.track.id === track.id);
                    return entry ? (
                      <span className="text-sm text-muted tabular-nums">
                        {formatTotalDuration(entry.seconds)}
                      </span>
                    ) : null;
                  }}
                />
              </section>
            ) : null}

            <div className="flex flex-col gap-10">
              {topArtists.length > 1 ? (
                <section aria-labelledby="top-artistes" className="flex flex-col gap-4">
                  <h2 id="top-artistes" className={SECTION_TITLE}>
                    Tes artistes
                  </h2>
                  <TopArtistsList entries={topArtists} labelledBy="top-artistes" />
                </section>
              ) : null}

              {summary.topGenres.length > 0 ? (
                <section aria-labelledby="top-genres" className="flex flex-col gap-4">
                  <h2 id="top-genres" className={SECTION_TITLE}>
                    Tes genres
                  </h2>
                  <GenreBreakdown genres={summary.topGenres} labelledBy="top-genres" />
                </section>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-10">
      <span className="sr-only">Chargement des statistiques…</span>
      <Skeleton className="h-48 w-full rounded-3xl" />
      <Skeleton className="h-40 w-full rounded-3xl" />
      <TrackListSkeleton rows={5} />
    </div>
  );
}
