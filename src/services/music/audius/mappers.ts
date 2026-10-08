import type { Artist, ArtistProfile, Artwork, Playlist, Track } from "@/types/music";
import {
  type AudiusArtwork,
  type AudiusCoverPhoto,
  type AudiusPlaylist,
  type AudiusTrack,
  type AudiusUser,
  type AudiusUserProfile,
  audiusPlaylistSchema,
  audiusTrackSchema,
  audiusUserProfileSchema,
} from "./schemas";

export function mapArtwork(artwork: AudiusArtwork): Artwork {
  return {
    small: artwork?.["150x150"],
    medium: artwork?.["480x480"],
    large: artwork?.["1000x1000"],
  };
}

function mapCoverPhoto(cover: AudiusCoverPhoto): Artwork {
  return { medium: cover?.["640x"], large: cover?.["2000x"] };
}

/** Audius stocke les tags en une seule chaîne séparée par des virgules. */
export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  const unique = new Set(
    tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  );
  return [...unique];
}

export function mapArtist(user: AudiusUser): Artist {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    isVerified: user.is_verified ?? false,
    avatar: mapArtwork(user.profile_picture),
  };
}

export function mapArtistProfile(user: AudiusUserProfile): ArtistProfile {
  return {
    ...mapArtist(user),
    bio: user.bio || null,
    location: user.location || null,
    cover: mapCoverPhoto(user.cover_photo),
    followerCount: user.follower_count ?? 0,
    trackCount: user.track_count ?? 0,
    playlistCount: user.playlist_count ?? 0,
  };
}

export function mapTrack(track: AudiusTrack): Track {
  return {
    id: track.id,
    title: track.title,
    durationSeconds: track.duration,
    genre: track.genre || null,
    mood: track.mood || null,
    description: track.description?.trim() || null,
    tags: parseTags(track.tags),
    releaseDate: track.release_date || null,
    playCount: track.play_count ?? 0,
    favoriteCount: track.favorite_count ?? 0,
    artwork: mapArtwork(track.artwork),
    artist: mapArtist(track.user),
  };
}

export function mapPlaylist(playlist: AudiusPlaylist): Playlist {
  return {
    id: playlist.id,
    name: playlist.playlist_name,
    description: playlist.description?.trim() || null,
    isAlbum: playlist.is_album ?? false,
    artwork: mapArtwork(playlist.artwork),
    owner: mapArtist(playlist.user),
    trackCount: playlist.track_count ?? 0,
    favoriteCount: playlist.favorite_count ?? 0,
    playCount: playlist.total_play_count ?? 0,
  };
}

/** Un morceau payant/réservé ou non diffusable ne peut pas être lu gratuitement. */
function isFreelyPlayable(track: AudiusTrack): boolean {
  return track.is_streamable !== false && track.is_stream_gated !== true;
}

/** Valide un morceau isolé ; `null` s'il est invalide ou non lisible gratuitement. */
export function parseTrack(item: unknown): Track | null {
  const result = audiusTrackSchema.safeParse(item);
  return result.success && isFreelyPlayable(result.data) ? mapTrack(result.data) : null;
}

/**
 * Valide chaque élément séparément : un morceau mal formé est écarté
 * au lieu de faire échouer toute la liste.
 */
export function parseTracks(items: readonly unknown[]): Track[] {
  return items.flatMap((item) => parseTrack(item) ?? []);
}

export function parsePlaylist(item: unknown): Playlist | null {
  const result = audiusPlaylistSchema.safeParse(item);
  return result.success && !result.data.is_private ? mapPlaylist(result.data) : null;
}

export function parsePlaylists(items: readonly unknown[]): Playlist[] {
  return items.flatMap((item) => parsePlaylist(item) ?? []);
}

export function parseArtistProfile(item: unknown): ArtistProfile | null {
  const result = audiusUserProfileSchema.safeParse(item);
  return result.success ? mapArtistProfile(result.data) : null;
}
