import { NextResponse } from "next/server";
import { z } from "zod";
import { getRadioTracks } from "@/features/radio/lib/get-radio-tracks";
import { musicProvider } from "@/services/music";

const querySchema = z.object({
  genre: z.string().trim().min(1).max(40).optional(),
  artist: z.string().regex(/^[A-Za-z0-9]{1,32}$/),
});

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
      // An empty list usually means a transient Audius outage: don't cache it.
      "Cache-Control":
        tracks.length > 0 ? "public, s-maxage=600, stale-while-revalidate=3600" : "no-store",
    },
  });
}
