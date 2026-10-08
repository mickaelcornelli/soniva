import type { Artist, Artwork, Track } from "@/types/music";
import {
  type AudiusArtwork,
  type AudiusTrack,
  type AudiusUser,
  audiusTrackSchema,
} from "./schemas";

export function mapArtwork(artwork: AudiusArtwork): Artwork {
  return {
    small: artwork?.["150x150"],
    medium: artwork?.["480x480"],
    large: artwork?.["1000x1000"],
  };
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

export function mapTrack(track: AudiusTrack): Track {
  return {
    id: track.id,
    title: track.title,
    durationSeconds: track.duration,
    genre: track.genre || null,
    mood: track.mood || null,
    playCount: track.play_count ?? 0,
    favoriteCount: track.favorite_count ?? 0,
    artwork: mapArtwork(track.artwork),
    artist: mapArtist(track.user),
  };
}

/** Un morceau payant/réservé ou non diffusable ne peut pas être lu gratuitement. */
function isFreelyPlayable(track: AudiusTrack): boolean {
  return track.is_streamable !== false && track.is_stream_gated !== true;
}

/**
 * Valide chaque élément séparément : un morceau mal formé est écarté
 * au lieu de faire échouer toute la liste.
 */
export function parseTracks(items: readonly unknown[]): Track[] {
  return items.flatMap((item) => {
    const result = audiusTrackSchema.safeParse(item);
    if (!result.success || !isFreelyPlayable(result.data)) return [];
    return [mapTrack(result.data)];
  });
}
