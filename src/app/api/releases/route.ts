import { NextResponse } from "next/server";
import { getLatestReleases } from "@/features/following/lib/get-latest-releases";
import { musicProvider } from "@/services/music";

/** Beyond this, one page view would cost too many Audius requests. */
const MAX_ARTISTS = 20;
const RELEASES_LIMIT = 20;
const ARTIST_ID_PATTERN = /^[A-Za-z0-9]{1,32}$/;

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
      // An empty list usually means a transient Audius outage: don't cache it.
      "Cache-Control":
        tracks.length > 0 ? "public, s-maxage=1800, stale-while-revalidate=3600" : "no-store",
    },
  });
}
