import { NextResponse } from "next/server";
import { musicProvider } from "@/services/music";

const MAX_IDS = 100;
const ARTIST_ID_PATTERN = /^[A-Za-z0-9]{1,32}$/;

/** Resolves followed artists, whose IDs are the only thing stored in the database. */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("ids") ?? "";
  const ids = [...new Set(raw.split(",").filter(Boolean))];

  if (ids.length > MAX_IDS || !ids.every((id) => ARTIST_ID_PATTERN.test(id))) {
    return NextResponse.json({ error: "Identifiants d'artistes invalides." }, { status: 400 });
  }

  try {
    const artists = await musicProvider.getArtists(ids);
    return NextResponse.json(artists, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("[artistes] provider indisponible", error);
    return NextResponse.json(
      { error: "Le service musical ne répond pas pour le moment." },
      { status: 502 },
    );
  }
}
