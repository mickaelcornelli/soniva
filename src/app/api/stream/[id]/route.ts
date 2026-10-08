import { NextResponse } from "next/server";
import { musicProvider } from "@/services/music";

/**
 * Point d'entrée unique du flux audio : le navigateur ne connaît que `/api/stream/:id`
 * et ignore quel provider sert la musique (ni sa clé, ni son URL).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.redirect(musicProvider.getStreamUrl(id), {
    status: 307,
    // L'URL cible d'un morceau ne change pas : le navigateur peut garder la redirection.
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
