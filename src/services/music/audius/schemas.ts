import { z } from "zod";

/*
 * Deliberately partial: only fields Soniva uses are validated, so
 * Audius adding or removing unused properties doesn't break the app.
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

export const audiusListResponseSchema = z.object({
  data: z.array(z.unknown()),
});

export const audiusItemResponseSchema = z.object({
  data: z.unknown(),
});

export type AudiusArtwork = z.infer<typeof audiusArtworkSchema>;
export type AudiusCoverPhoto = z.infer<typeof audiusCoverPhotoSchema>;
export type AudiusUser = z.infer<typeof audiusUserSchema>;
export type AudiusUserProfile = z.infer<typeof audiusUserProfileSchema>;
export type AudiusTrack = z.infer<typeof audiusTrackSchema>;
export type AudiusPlaylist = z.infer<typeof audiusPlaylistSchema>;
