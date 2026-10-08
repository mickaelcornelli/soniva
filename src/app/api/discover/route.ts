import { NextResponse } from "next/server";
import { z } from "zod";
import { musicProvider } from "@/services/music";
import type { Recommendations } from "@/features/discover/types";

const MAX_GENRES = 3;
const TRACKS_PER_GENRE = 12;
const RELATED_ARTISTS_LIMIT = 6;

const querySchema = z.object({
  genres: z
    .string()
    .default("")
    .transform((raw) => [...new Set(raw.split(",").map((genre) => genre.trim()))].filter(Boolean))
    .pipe(z.array(z.string().max(40)).max(MAX_GENRES)),
  // Identifiants Audius : courts et alphanumériques.
  artist: z
    .string()
    .regex(/^[A-Za-z0-9]{1,32}$/)
    .optional(),
});

/**
 * Matière première des recommandations (`/api/discover?genres=A,B&artist=ID`).
 * Le profil de goûts est calculé dans le navigateur : le serveur ne reçoit que
 * quelques genres et un artiste, jamais l'historique complet.
 */
export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const query = querySchema.safeParse(params);
  if (!query.success) {
    return NextResponse.json({ error: "Paramètres de découverte invalides." }, { status: 400 });
  }

  const { genres, artist } = query.data;

  try {
    const [byGenre, relatedArtists] = await Promise.all([
      Promise.all(
        genres.map(async (genre) => ({
          genre,
          tracks: await musicProvider.getTrendingTracks({ genre, limit: TRACKS_PER_GENRE }),
        })),
      ),
      artist
        ? musicProvider.getRelatedArtists(artist, { limit: RELATED_ARTISTS_LIMIT })
        : Promise.resolve([]),
    ]);

    const body: Recommendations = { genres: byGenre, relatedArtists };
    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("[découverte] provider indisponible", error);
    return NextResponse.json(
      { error: "Le service musical ne répond pas pour le moment." },
      { status: 502 },
    );
  }
}
