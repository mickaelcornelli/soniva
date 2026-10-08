import { NextResponse } from "next/server";
import { z } from "zod";
import { getRadioTracks } from "@/features/radio/lib/get-radio-tracks";
import { musicProvider } from "@/services/music";

const querySchema = z.object({
  genre: z.string().trim().min(1).max(40).optional(),
  // Identifiants Audius : courts et alphanumériques.
  artist: z.string().regex(/^[A-Za-z0-9]{1,32}$/),
});

/** Morceaux candidats pour la radio (`/api/radio?artist=ID&genre=G`). */
export async function GET(request: Request) {
  const query = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!query.success) {
    return NextResponse.json({ error: "Paramètres de radio invalides." }, { status: 400 });
  }

  const tracks = await getRadioTracks(musicProvider, {
    genre: query.data.genre,
    artistId: query.data.artist,
  });
  return NextResponse.json(tracks, {
    headers: {
      // Une liste vide trahit souvent une panne passagère d'Audius : on ne la met pas en cache.
      "Cache-Control":
        tracks.length > 0 ? "public, s-maxage=600, stale-while-revalidate=3600" : "no-store",
    },
  });
}
