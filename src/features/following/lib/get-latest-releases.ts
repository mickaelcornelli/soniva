import { loadOptional } from "@/lib/load-optional";
import type { MusicProvider } from "@/services/music/music-provider";
import type { Track } from "@/types/music";

const TRACKS_PER_ARTIST = 3;
/* Audius allows 10 requests per second: query artists in small batches. */
const BATCH_SIZE = 5;

/** Missing or unreadable dates sort last. */
function releaseTime(track: Track): number {
  const time = track.releaseDate ? Date.parse(track.releaseDate) : Number.NaN;
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

function byReleaseDateDesc(a: Track, b: Track): number {
  return releaseTime(b) - releaseTime(a);
}

export async function getLatestReleases(
  provider: MusicProvider,
  artistIds: readonly string[],
  limit: number,
): Promise<Track[]> {
  const tracks: Track[] = [];
  for (let i = 0; i < artistIds.length; i += BATCH_SIZE) {
    const batch = artistIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((artistId) =>
        // One unavailable artist must not hide the others.
        loadOptional(
          () => provider.getArtistLatestTracks(artistId, { limit: TRACKS_PER_ARTIST }),
          [],
          "nouveautés",
        ),
      ),
    );
    tracks.push(...results.flat());
  }

  const unique = [...new Map(tracks.map((track) => [track.id, track])).values()];
  return unique.sort(byReleaseDateDesc).slice(0, limit);
}
