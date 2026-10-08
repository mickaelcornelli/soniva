import { z } from "zod";

/*
 * Schémas volontairement partiels : on ne valide que les champs utilisés par Soniva.
 * Les champs inconnus sont ignorés, ce qui évite de casser l'app quand Audius
 * ajoute ou retire des propriétés dont on ne se sert pas.
 */

const audiusArtworkSchema = z
  .object({
    "150x150": z.string().optional(),
    "480x480": z.string().optional(),
    "1000x1000": z.string().optional(),
  })
  .nullish();

const audiusCoverPhotoSchema = z
  .object({
    "640x": z.string().optional(),
    "2000x": z.string().optional(),
  })
  .nullish();

export const audiusUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string(),
  is_verified: z.boolean().optional(),
  profile_picture: audiusArtworkSchema,
});

export const audiusUserProfileSchema = audiusUserSchema.extend({
  bio: z.string().nullish(),
  location: z.string().nullish(),
  cover_photo: audiusCoverPhotoSchema,
  follower_count: z.number().optional(),
  track_count: z.number().optional(),
  playlist_count: z.number().optional(),
});

export const audiusTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number().nonnegative(),
  genre: z.string().nullish(),
  mood: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.string().nullish(),
  release_date: z.string().nullish(),
  play_count: z.number().optional(),
  favorite_count: z.number().optional(),
  artwork: audiusArtworkSchema,
  user: audiusUserSchema,
  is_streamable: z.boolean().optional(),
  is_stream_gated: z.boolean().optional(),
});

export const audiusPlaylistSchema = z.object({
  id: z.string(),
  playlist_name: z.string(),
  description: z.string().nullish(),
  is_album: z.boolean().optional(),
  is_private: z.boolean().optional(),
  artwork: audiusArtworkSchema,
  user: audiusUserSchema,
  track_count: z.number().optional(),
  favorite_count: z.number().optional(),
  total_play_count: z.number().optional(),
});

/** Enveloppe des réponses de liste : `{ data: [...] }`. */
export const audiusListResponseSchema = z.object({
  data: z.array(z.unknown()),
});

/** Enveloppe des réponses unitaires : `{ data: {...} }`. */
export const audiusItemResponseSchema = z.object({
  data: z.unknown(),
});

export type AudiusArtwork = z.infer<typeof audiusArtworkSchema>;
export type AudiusCoverPhoto = z.infer<typeof audiusCoverPhotoSchema>;
export type AudiusUser = z.infer<typeof audiusUserSchema>;
export type AudiusUserProfile = z.infer<typeof audiusUserProfileSchema>;
export type AudiusTrack = z.infer<typeof audiusTrackSchema>;
export type AudiusPlaylist = z.infer<typeof audiusPlaylistSchema>;
