import type { Artist, Track } from "@/types/music";

/* A favourite is a stronger signal than a single play. */
const FAVORITE_WEIGHT = 3;
const PLAY_WEIGHT = 1;
const MAX_GENRES = 2;

export interface TasteProfile {
  genres: string[];
  topArtist: Artist | null;
  knownTrackIds: Set<string>;
}

function topEntries<T>(scores: Map<string, { item: T; score: number }>, count: number): T[] {
  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ item }) => item);
}

export function buildTasteProfile(
  favorites: readonly Track[],
  history: readonly Track[],
): TasteProfile {
  const genres = new Map<string, { item: string; score: number }>();
  const artists = new Map<string, { item: Artist; score: number }>();

  const add = (track: Track, weight: number) => {
    if (track.genre) {
      const entry = genres.get(track.genre) ?? { item: track.genre, score: 0 };
      genres.set(track.genre, { ...entry, score: entry.score + weight });
    }
    const artist = artists.get(track.artist.id) ?? { item: track.artist, score: 0 };
    artists.set(track.artist.id, { ...artist, score: artist.score + weight });
  };

  for (const track of favorites) add(track, FAVORITE_WEIGHT);
  for (const track of history) add(track, PLAY_WEIGHT);

  return {
    genres: topEntries(genres, MAX_GENRES),
    topArtist: topEntries(artists, 1)[0] ?? null,
    knownTrackIds: new Set([...favorites, ...history].map((track) => track.id)),
  };
}

export function pickFreshTracks(
  tracks: readonly Track[],
  excluded: ReadonlySet<string>,
  limit: number,
): Track[] {
  return tracks.filter((track) => !excluded.has(track.id)).slice(0, limit);
}
