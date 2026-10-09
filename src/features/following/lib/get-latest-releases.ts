import { loadOptional } from "@/lib/load-optional";
import type { MusicProvider } from "@/services/music/music-provider";
import type { Track } from "@/types/music";

const TRACKS_PER_ARTIST = 3;
/*
 * Audius autorise 10 requêtes par seconde : les artistes sont interrogés par petits
 * paquets plutôt que tous à la fois.
 */
const BATCH_SIZE = 5;

/** Horodatage de sortie ; une date absente ou illisible classe le morceau en dernier. */
function releaseTime(track: Track): number {
  const time = track.releaseDate ? Date.parse(track.releaseDate) : Number.NaN;
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

/** Du plus récent au plus ancien. */
function byReleaseDateDesc(a: Track, b: Track): number {
  return releaseTime(b) - releaseTime(a);
}

/** Derniers morceaux d'une liste d'artistes, fusionnés et triés par date de sortie. */
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
        // Un artiste indisponible ne doit pas priver l'utilisateur des autres.
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
