import { NextResponse } from "next/server";
import { musicProvider } from "@/services/music";

const MAX_IDS = 100;
const TRACK_ID_PATTERN = /^[A-Za-z0-9]{1,32}$/;

/** Resolves the user's library, whose track IDs are the only thing stored in the database. */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("ids") ?? "";
  const ids = [...new Set(raw.split(",").filter(Boolean))];

  if (ids.length > MAX_IDS || !ids.every((id) => TRACK_ID_PATTERN.test(id))) {
    return NextResponse.json({ error: "Identifiants de morceaux invalides." }, { status: 400 });
  }

  try {
    const tracks = await musicProvider.getTracks(ids);
    return NextResponse.json(tracks, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("[morceaux] provider indisponible", error);
    return NextResponse.json(
      { error: "Le service musical ne répond pas pour le moment." },
      { status: 502 },
    );
  }
}
