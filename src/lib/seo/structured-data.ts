import { pickArtworkUrl } from "@/lib/artwork";
import { routes } from "@/lib/routes";
import type { ArtistProfile, Playlist, Track } from "@/types/music";
import { absoluteUrl } from "./absolute-url";

/** Durée ISO 8601 attendue par schema.org : 214 s → « PT3M34S ». */
export function toIsoDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `PT${m}M${s}S`;
}

function musicRecording(track: Track) {
  return {
    "@type": "MusicRecording",
    name: track.title,
    url: absoluteUrl(routes.track(track.id)),
    duration: toIsoDuration(track.durationSeconds),
    byArtist: {
      "@type": "MusicGroup",
      name: track.artist.name,
      url: absoluteUrl(routes.artist(track.artist.handle)),
    },
  };
}

export function trackStructuredData(track: Track) {
  return {
    "@context": "https://schema.org",
    ...musicRecording(track),
    image: pickArtworkUrl(track.artwork, "large"),
    genre: track.genre ?? undefined,
    datePublished: track.releaseDate ?? undefined,
    keywords: track.tags.length > 0 ? track.tags.join(", ") : undefined,
  };
}

export function artistStructuredData(artist: ArtistProfile, topTracks: readonly Track[]) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: absoluteUrl(routes.artist(artist.handle)),
    image: pickArtworkUrl(artist.avatar, "large"),
    description: artist.bio ?? undefined,
    track: topTracks.map(musicRecording),
  };
}

export function playlistStructuredData(playlist: Playlist, tracks: readonly Track[]) {
  return {
    "@context": "https://schema.org",
    "@type": playlist.isAlbum ? "MusicAlbum" : "MusicPlaylist",
    name: playlist.name,
    url: absoluteUrl(routes.playlist(playlist.id)),
    image: pickArtworkUrl(playlist.artwork, "large"),
    numTracks: tracks.length,
    track: tracks.map(musicRecording),
  };
}

/** Classement d'un genre : une liste ordonnée de morceaux. */
export function genreChartStructuredData(
  { name, path }: { name: string; path: string },
  tracks: readonly Track[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: tracks.length,
    itemListElement: tracks.map((track, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: musicRecording(track),
    })),
  };
}
