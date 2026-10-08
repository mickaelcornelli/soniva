"use client";

import Link from "next/link";
import { useEffect, useId } from "react";
import { ArtistCard } from "@/components/music/artist-card";
import { TrackList } from "@/components/music/track-list";
import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { findGenreByName, genreLabel } from "@/lib/genres";
import { routes } from "@/lib/routes";
import { useRecommendations } from "../hooks/use-recommendations";
import { isEmptyRecommendation } from "../lib/select-recommendations";
import type { GenreRecommendation, Recommendations } from "../types";

const SUBSECTION_TITLE = "font-display text-lg font-semibold";
const ARTIST_GRID = "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6";

interface ForYouSectionProps {
  /** Morceaux déjà visibles sur la page (ex. le classement), à ne pas reproposer. */
  excludeTrackIds?: readonly string[];
}

/**
 * « Pour toi » : morceaux en vogue dans les genres préférés de l'utilisateur et artistes
 * proches de son artiste favori. Section secondaire : invisible tant qu'il n'y a pas de
 * goûts connus, et masquée plutôt qu'affichée en erreur.
 */
export function ForYouSection({ excludeTrackIds }: ForYouSectionProps) {
  const headingId = useId();
  const { hasTaste, topArtist, recommendations, isLoading, isError, error } = useRecommendations({
    excludeTrackIds,
  });

  useEffect(() => {
    if (isError) console.error("[découverte] recommandations indisponibles", error);
  }, [isError, error]);

  if (!hasTaste || isError) return null;
  if (!isLoading && (!recommendations || isEmptyRecommendation(recommendations))) return null;

  return (
    <section aria-labelledby={headingId} aria-busy={isLoading} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="font-display text-xl font-semibold">
          Pour toi
        </h2>
        <p className="text-sm text-muted">D&apos;après tes favoris et tes dernières écoutes.</p>
      </div>

      {isLoading || !recommendations ? (
        <ForYouSkeleton />
      ) : (
        <div className="flex flex-col gap-10">
          {recommendations.genres.map(({ genre, tracks }) => (
            <GenreBlock key={genre} genre={genre} tracks={tracks} />
          ))}

          {recommendations.relatedArtists.length > 0 && topArtist ? (
            <RelatedArtistsBlock
              artistName={topArtist.name}
              artists={recommendations.relatedArtists}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}

function GenreBlock({ genre, tracks }: GenreRecommendation) {
  const titleId = useId();
  const genrePage = findGenreByName(genre);
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id={titleId} className={SUBSECTION_TITLE}>
          Parce que tu écoutes <span className="text-accent">{genreLabel(genre)}</span>
        </h3>
        {genrePage ? (
          <Link
            href={routes.genre(genrePage.slug)}
            className="text-sm text-muted hover:text-foreground hover:underline"
          >
            Tout le genre {genrePage.label}
          </Link>
        ) : null}
      </div>
      <TrackList tracks={tracks} columns={2} labelledBy={titleId} />
    </section>
  );
}

function RelatedArtistsBlock({
  artistName,
  artists,
}: {
  artistName: string;
  artists: Recommendations["relatedArtists"];
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <h3 id={titleId} className={SUBSECTION_TITLE}>
        Dans l&apos;esprit de <span className="text-accent">{artistName}</span>
      </h3>
      <ul className={ARTIST_GRID}>
        {artists.map((artist) => (
          <li key={artist.id}>
            <ArtistCard artist={artist} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ForYouSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-56" />
      <TrackListSkeleton rows={6} columns={2} />
    </div>
  );
}
