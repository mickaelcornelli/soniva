import { NextResponse } from "next/server";
import { isSearchable, normalizeSearchQuery } from "@/lib/search";
import { musicProvider } from "@/services/music";
import type { SearchResults } from "@/types/music";

const EMPTY_RESULTS: SearchResults = { tracks: [], artists: [], playlists: [] };

export async function GET(request: Request) {
  const query = normalizeSearchQuery(new URL(request.url).searchParams.get("q"));
  if (!isSearchable(query)) return NextResponse.json(EMPTY_RESULTS);

  try {
    const results = await musicProvider.search(query);
    return NextResponse.json(results, {
      // Same results for everyone, so the CDN can serve them for a few minutes.
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[recherche] provider indisponible", error);
    return NextResponse.json(
      { error: "Le service musical ne répond pas pour le moment." },
      { status: 502 },
    );
  }
}
