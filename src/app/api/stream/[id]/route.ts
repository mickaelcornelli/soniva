import { NextResponse } from "next/server";
import { musicProvider } from "@/services/music";

/**
 * Single audio entry point: the browser never sees which provider serves the music, nor its key.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.redirect(musicProvider.getStreamUrl(id), {
    status: 307,
    // A track's target URL never changes, so the browser may cache the redirect.
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
