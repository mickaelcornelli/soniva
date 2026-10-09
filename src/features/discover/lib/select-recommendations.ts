import type { Recommendations } from "../types";
import { pickFreshTracks } from "./taste-profile";

const TRACKS_PER_GENRE = 6;

export function selectRecommendations(
  data: Recommendations,
  excludedTrackIds: ReadonlySet<string>,
  referenceArtistId: string | undefined,
): Recommendations {
  const shown = new Set(excludedTrackIds);

  const genres = data.genres
    .map(({ genre, tracks }) => {
      const fresh = pickFreshTracks(tracks, shown, TRACKS_PER_GENRE);
      for (const track of fresh) shown.add(track.id);
      return { genre, tracks: fresh };
    })
    .filter(({ tracks }) => tracks.length > 0);

  return {
    genres,
    relatedArtists: data.relatedArtists.filter((artist) => artist.id !== referenceArtistId),
  };
}

export function isEmptyRecommendation({ genres, relatedArtists }: Recommendations): boolean {
  return genres.length === 0 && relatedArtists.length === 0;
}
