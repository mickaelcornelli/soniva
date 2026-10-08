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

export const audiusUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string(),
  is_verified: z.boolean().optional(),
  profile_picture: audiusArtworkSchema,
});

export const audiusTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number().nonnegative(),
  genre: z.string().nullish(),
  mood: z.string().nullish(),
  play_count: z.number().optional(),
  favorite_count: z.number().optional(),
  artwork: audiusArtworkSchema,
  user: audiusUserSchema,
  is_streamable: z.boolean().optional(),
  is_stream_gated: z.boolean().optional(),
});

/** Enveloppe commune des réponses de liste : `{ data: [...] }`. */
export const audiusListResponseSchema = z.object({
  data: z.array(z.unknown()),
});

export type AudiusArtwork = z.infer<typeof audiusArtworkSchema>;
export type AudiusUser = z.infer<typeof audiusUserSchema>;
export type AudiusTrack = z.infer<typeof audiusTrackSchema>;
