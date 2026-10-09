import { Disc3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/empty-state";
import { GenrePills } from "@/features/genres/components/genre-pills";
import { PeriodFilter } from "@/features/genres/components/period-filter";
import { TrendingChart } from "@/features/trending/components/trending-chart";
import { findGenreBySlug, relatedGenres } from "@/lib/genres";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { genreChartStructuredData } from "@/lib/seo/structured-data";
import {
  DEFAULT_TRENDING_PERIOD,
  parseTrendingPeriod,
  trendingPeriodLabel,
} from "@/lib/trending-period";
import { musicProvider } from "@/services/music";
import type { TrendingPeriod } from "@/types/music";

const CHART_SIZE = 20;
const RELATED_GENRES_COUNT = 8;

interface GenrePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ period?: string | string[] }>;
}

// Deduplicates the call between generateMetadata and the page within one render.
const loadChart = cache((genreName: string, period: TrendingPeriod) =>
  musicProvider.getTrendingTracks({ genre: genreName, period, limit: CHART_SIZE }),
);

export async function generateMetadata({
  params,
  searchParams,
}: GenrePageProps): Promise<Metadata> {
  const genre = findGenreBySlug((await params).slug);
  if (!genre) return { title: "Genre introuvable", robots: { index: false } };

  const period = parseTrendingPeriod((await searchParams).period);
  const metadata = buildPageMetadata({
    title: `${genre.label} : les morceaux du moment`,
    description: `Les morceaux ${genre.label} les plus écoutés sur Soniva, à écouter gratuitement : tendances de la semaine, du mois, de l'année et de tous les temps.`,
    // Every period shares the same canonical page (week).
    path: routes.genre(genre.slug),
  });
  return period === DEFAULT_TRENDING_PERIOD
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const genre = findGenreBySlug((await params).slug);
  if (!genre) notFound();

  const period = parseTrendingPeriod((await searchParams).period);
  const tracks = await loadChart(genre.name, period);
  const related = relatedGenres(genre, RELATED_GENRES_COUNT);

  return (
    <PageContainer>
      <JsonLd
        data={genreChartStructuredData(
          {
            name: `${genre.label} — ${trendingPeriodLabel(period)}`,
            path: routes.genre(genre.slug, period),
          },
          tracks,
        )}
      />

      <header className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            <Link href={routes.genres} className="hover:text-foreground hover:underline">
              Genres
            </Link>
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            {genre.label}
          </h1>
          <p className="text-lg text-muted">
            Les morceaux les plus écoutés · {trendingPeriodLabel(period).toLowerCase()}
          </p>
        </div>
        <PeriodFilter genreSlug={genre.slug} current={period} />
      </header>

      {tracks.length > 0 ? (
        <TrendingChart tracks={tracks} />
      ) : (
        <EmptyState
          icon={Disc3}
          title="Rien à écouter pour cette période"
          description={`Aucun morceau ${genre.label} ne ressort du classement sur cette période. Essaie une autre période ou un genre voisin.`}
        />
      )}

      {related.length > 0 ? (
        <section aria-labelledby="genres-voisins" className="flex flex-col gap-4">
          <h2 id="genres-voisins" className="font-display text-xl font-semibold">
            Explorer aussi
          </h2>
          <GenrePills genres={related} labelledBy="genres-voisins" />
        </section>
      ) : null}
    </PageContainer>
  );
}
