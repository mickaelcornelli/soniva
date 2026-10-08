import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { ArtistLink } from "@/components/music/artist-link";
import { MediaHero } from "@/components/music/media-hero";
import { TagList } from "@/components/music/tag-list";
import { TrackList } from "@/components/music/track-list";
import { TrackStats } from "@/components/music/track-stats";
import { JsonLd } from "@/components/seo/json-ld";
import { RichText } from "@/components/ui/rich-text";
import { FavoriteButton } from "@/features/library/components/favorite-button";
import { PlayTracksButton } from "@/features/player/components/play-tracks-button";
import { pickArtworkUrl } from "@/lib/artwork";
import { loadOptional } from "@/lib/load-optional";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { trackStructuredData } from "@/lib/seo/structured-data";
import { musicProvider } from "@/services/music";

const MORE_TRACKS_COUNT = 5;

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

// Dédoublonne l'appel entre generateMetadata et la page pendant un même rendu.
const loadTrack = cache((id: string) => musicProvider.getTrack(id));

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const track = await loadTrack((await params).id);
  if (!track) return { title: "Morceau introuvable", robots: { index: false } };

  return buildPageMetadata({
    title: `${track.title} — ${track.artist.name}`,
    description:
      track.description ?? `Écoute ${track.title} de ${track.artist.name} gratuitement sur Soniva.`,
    path: routes.track(track.id),
    image: pickArtworkUrl(track.artwork, "large"),
  });
}

export default async function TrackPage({ params }: TrackPageProps) {
  const track = await loadTrack((await params).id);
  if (!track) notFound();

  const artistTracks = await loadOptional(
    // Un de plus que nécessaire, car le morceau courant en fait souvent partie.
    () => musicProvider.getArtistTopTracks(track.artist.id, { limit: MORE_TRACKS_COUNT + 1 }),
    [],
    "page morceau",
  );
  const moreTracks = artistTracks.filter(({ id }) => id !== track.id).slice(0, MORE_TRACKS_COUNT);

  return (
    <PageContainer>
      <JsonLd data={trackStructuredData(track)} />

      <MediaHero
        artwork={track.artwork}
        artworkAlt={`Pochette de ${track.title}`}
        title={track.title}
      >
        <ArtistLink artist={track.artist} className="text-lg" />
        <TrackStats track={track} detailed />
        <TagList tags={track.tags} />
        <div className="flex items-center gap-3">
          <PlayTracksButton tracks={[track, ...moreTracks]} />
          <FavoriteButton track={track} size="md" />
        </div>
      </MediaHero>

      {track.description ? (
        <section aria-labelledby="a-propos" className="flex max-w-2xl flex-col gap-3">
          <h2 id="a-propos" className="font-display text-xl font-semibold">
            À propos
          </h2>
          <RichText text={track.description} />
        </section>
      ) : null}

      {moreTracks.length > 0 ? (
        <section aria-labelledby="plus-artiste" className="flex flex-col gap-4">
          <h2 id="plus-artiste" className="font-display text-xl font-semibold">
            Plus de {track.artist.name}
          </h2>
          <TrackList tracks={moreTracks} labelledBy="plus-artiste" />
        </section>
      ) : null}
    </PageContainer>
  );
}
