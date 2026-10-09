/** Écoutes d'un morceau sur un mois : la forme commune aux données locales et au compte. */
export interface ListeningRow {
  trackId: string;
  artistId: string;
  genre: string | null;
  plays: number;
  seconds: number;
}

export interface RankedArtist {
  artistId: string;
  plays: number;
  seconds: number;
}

export interface RankedGenre {
  genre: string;
  seconds: number;
  /** Part du temps d'écoute total, entre 0 et 1. */
  share: number;
}

export interface MonthSummary {
  totalSeconds: number;
  totalPlays: number;
  trackCount: number;
  artistCount: number;
  topTracks: ListeningRow[];
  topArtists: RankedArtist[];
  topGenres: RankedGenre[];
}

const TOP_SIZE = 5;

/** Classement au temps d'écoute ; à égalité, le plus écouté (en nombre de fois) d'abord. */
function byListening<T extends { seconds: number; plays: number }>(a: T, b: T): number {
  return b.seconds - a.seconds || b.plays - a.plays;
}

/** Résumé d'un mois d'écoute : totaux et classements (morceaux, artistes, genres). */
export function summarizeMonth(rows: readonly ListeningRow[], topSize = TOP_SIZE): MonthSummary {
  const artists = new Map<string, RankedArtist>();
  const genres = new Map<string, number>();
  let totalSeconds = 0;
  let totalPlays = 0;

  for (const row of rows) {
    totalSeconds += row.seconds;
    totalPlays += row.plays;

    const artist = artists.get(row.artistId) ?? { artistId: row.artistId, plays: 0, seconds: 0 };
    artists.set(row.artistId, {
      ...artist,
      plays: artist.plays + row.plays,
      seconds: artist.seconds + row.seconds,
    });

    if (row.genre) genres.set(row.genre, (genres.get(row.genre) ?? 0) + row.seconds);
  }

  const genreSeconds = [...genres.values()].reduce((sum, seconds) => sum + seconds, 0);

  return {
    totalSeconds,
    totalPlays,
    trackCount: rows.length,
    artistCount: artists.size,
    topTracks: [...rows].sort(byListening).slice(0, topSize),
    topArtists: [...artists.values()].sort(byListening).slice(0, topSize),
    topGenres: [...genres.entries()]
      .map(([genre, seconds]) => ({
        genre,
        seconds,
        share: genreSeconds > 0 ? seconds / genreSeconds : 0,
      }))
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, topSize),
  };
}
