import { loadOptional } from "@/lib/load-optional";
import type { MusicProvider } from "@/services/music/music-provider";
import type { Track } from "@/types/music";

const GENRE_TRACKS_LIMIT = 20;
const RELATED_ARTISTS_LIMIT = 3;
const TRACKS_PER_RELATED_ARTIST = 5;

export interface RadioSeed {
  genre?: string | undefined;
  artistId: string;
}

/** Each source is optional; the radio does its best with whatever responds. */
export async function getRadioTracks(
  provider: MusicProvider,
  { genre, artistId }: RadioSeed,
): Promise<Track[]> {
  const [genreTracks, relatedArtists] = await Promise.all([
    genre
      ? loadOptional(
          () => provider.getTrendingTracks({ genre, limit: GENRE_TRACKS_LIMIT }),
          [],
          "radio",
        )
      : Promise.resolve([]),
    loadOptional(
      () => provider.getRelatedArtists(artistId, { limit: RELATED_ARTISTS_LIMIT }),
      [],
      "radio",
    ),
  ]);

  const artistTracks = await Promise.all(
    relatedArtists.map((artist) =>
      loadOptional(
        () => provider.getArtistTopTracks(artist.id, { limit: TRACKS_PER_RELATED_ARTIST }),
        [],
        "radio",
      ),
    ),
  );

  return [...artistTracks.flat(), ...genreTracks];
}
