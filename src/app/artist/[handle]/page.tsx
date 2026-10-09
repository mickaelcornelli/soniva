import { Music } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { TrackList } from "@/components/music/track-list";
import { JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/empty-state";
import { RichText } from "@/components/ui/rich-text";
import { ArtistHero } from "@/features/artist/components/artist-hero";
import { FollowButton } from "@/features/library/components/follow-button";
import { PlayTracksButton } from "@/features/player/components/play-tracks-button";
import { ShareButton } from "@/features/share/components/share-button";
import { pickArtworkUrl } from "@/lib/artwork";
import { loadOptional } from "@/lib/load-optional";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { artistStructuredData } from "@/lib/seo/structured-data";
import { musicProvider } from "@/services/music";

const TOP_TRACKS_COUNT = 10;

interface ArtistPageProps {
  params: Promise<{ handle: string }>;
}

// Deduplicates the call between generateMetadata and the
// page within one render. Next passes the encoded segment.
const loadArtist = cache((handle: string) =>
  musicProvider.getArtistByHandle(decodeURIComponent(handle)),
);

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const artist = await loadArtist((await params).handle);
  if (!artist) return { title: "Artiste introuvable", robots: { index: false } };

  return buildPageMetadata({
    title: artist.name,
    description: artist.bio ?? `Écoute les morceaux de ${artist.name} gratuitement sur Soniva.`,
    path: routes.artist(artist.handle),
    image: pickArtworkUrl(artist.avatar, "large"),
  });
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = await loadArtist((await params).handle);
  if (!artist) notFound();

  const topTracks = await loadOptional(
    () => musicProvider.getArtistTopTracks(artist.id, { limit: TOP_TRACKS_COUNT }),
    [],
    "page artiste",
  );

  return (
    <PageContainer>
      <JsonLd data={artistStructuredData(artist, topTracks)} />
      <ArtistHero
        artist={artist}
        actions={
          <>
            <FollowButton artist={artist} />
            <ShareButton title={artist.name} path={routes.artist(artist.handle)} />
          </>
        }
      />

      {artist.bio ? (
        <section aria-labelledby="bio" className="flex max-w-2xl flex-col gap-3">
          <h2 id="bio" className="font-display text-xl font-semibold">
            Biographie
          </h2>
          <RichText text={artist.bio} />
        </section>
      ) : null}

      <section aria-labelledby="populaires" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="populaires" className="font-display text-xl font-semibold">
            Titres populaires
          </h2>
          <PlayTracksButton tracks={topTracks} />
        </div>
        {topTracks.length > 0 ? (
          <TrackList tracks={topTracks} labelledBy="populaires" />
        ) : (
          <EmptyState
            icon={Music}
            title="Aucun morceau à écouter"
            description={`${artist.name} n'a pas encore publié de morceau disponible en écoute gratuite.`}
          />
        )}
      </section>
    </PageContainer>
  );
}
