import { ListMusic } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { ArtistLink } from "@/components/music/artist-link";
import { MediaHero } from "@/components/music/media-hero";
import { TrackList } from "@/components/music/track-list";
import { JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/empty-state";
import { RichText } from "@/components/ui/rich-text";
import { PlayTracksButton } from "@/features/player/components/play-tracks-button";
import { pickArtworkUrl } from "@/lib/artwork";
import { formatTotalDuration } from "@/lib/format/duration";
import { formatCompactNumber } from "@/lib/format/number";
import { pluralize } from "@/lib/format/plural";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { playlistStructuredData } from "@/lib/seo/structured-data";
import { musicProvider } from "@/services/music";

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

// Dédoublonne l'appel entre generateMetadata et la page pendant un même rendu.
const loadPlaylist = cache((id: string) => musicProvider.getPlaylist(id));

export async function generateMetadata({ params }: PlaylistPageProps): Promise<Metadata> {
  const playlist = await loadPlaylist((await params).id);
  if (!playlist) return { title: "Playlist introuvable", robots: { index: false } };

  const kind = playlist.isAlbum ? "Album" : "Playlist";
  return buildPageMetadata({
    title: `${playlist.name} — ${kind} de ${playlist.owner.name}`,
    description:
      playlist.description ??
      `${kind} de ${playlist.owner.name} : ${pluralize(playlist.trackCount, "morceau", "morceaux")} à écouter gratuitement sur Soniva.`,
    path: routes.playlist(playlist.id),
    image: pickArtworkUrl(playlist.artwork, "large"),
  });
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;
  const [playlist, tracks] = await Promise.all([
    loadPlaylist(id),
    musicProvider.getPlaylistTracks(id),
  ]);
  if (!playlist) notFound();

  const totalSeconds = tracks.reduce((sum, track) => sum + track.durationSeconds, 0);

  return (
    <PageContainer>
      <JsonLd data={playlistStructuredData(playlist, tracks)} />

      <MediaHero
        artwork={playlist.artwork}
        artworkAlt={`Pochette de ${playlist.name}`}
        title={playlist.name}
        kind={playlist.isAlbum ? "Album" : "Playlist"}
      >
        <ArtistLink artist={playlist.owner} className="text-lg" />
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <li>{pluralize(tracks.length, "morceau", "morceaux")}</li>
          <li>{formatTotalDuration(totalSeconds)}</li>
          <li>{formatCompactNumber(playlist.playCount)} écoutes</li>
        </ul>
        {playlist.description ? (
          <RichText text={playlist.description} className="max-w-2xl" />
        ) : null}
        <PlayTracksButton tracks={tracks} />
      </MediaHero>

      <section aria-labelledby="titres" className="flex flex-col gap-4">
        <h2 id="titres" className="sr-only">
          Titres
        </h2>
        {tracks.length > 0 ? (
          <TrackList tracks={tracks} labelledBy="titres" />
        ) : (
          <EmptyState
            icon={ListMusic}
            title="Aucun morceau lisible"
            description="Cette playlist est vide, ou ses morceaux ne sont pas disponibles en écoute gratuite."
          />
        )}
      </section>
    </PageContainer>
  );
}
