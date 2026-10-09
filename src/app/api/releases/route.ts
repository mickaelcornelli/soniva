import { NextResponse } from "next/server";
import { getLatestReleases } from "@/features/following/lib/get-latest-releases";
import { musicProvider } from "@/services/music";

/** Au-delà, la requête coûterait trop d'appels à Audius pour un seul affichage. */
const MAX_ARTISTS = 20;
const RELEASES_LIMIT = 20;
const ARTIST_ID_PATTERN = /^[A-Za-z0-9]{1,32}$/;

/** Derniers morceaux des artistes suivis (`/api/releases?artists=a,b`). */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("artists") ?? "";
  const ids = [...new Set(raw.split(",").filter(Boolean))];

  if (
    ids.length === 0 ||
    ids.length > MAX_ARTISTS ||
    !ids.every((id) => ARTIST_ID_PATTERN.test(id))
  ) {
    return NextResponse.json({ error: "Identifiants d'artistes invalides." }, { status: 400 });
  }

  const tracks = await getLatestReleases(musicProvider, ids, RELEASES_LIMIT);
  return NextResponse.json(tracks, {
    headers: {
      // Une liste vide trahit souvent une panne passagère d'Audius : on ne la met pas en cache.
      "Cache-Control":
        tracks.length > 0 ? "public, s-maxage=1800, stale-while-revalidate=3600" : "no-store",
    },
  });
}
