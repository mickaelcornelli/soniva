/**
 * Types du domaine musical, indépendants de tout provider.
 * Les composants et hooks ne manipulent que ces types, jamais les réponses brutes d'Audius.
 */

export type ArtworkSize = "small" | "medium" | "large";

/** URLs d'une image par taille ; une taille peut manquer selon le provider. */
export type Artwork = Partial<Record<ArtworkSize, string>>;

export interface Artist {
  id: string;
  name: string;
  handle: string;
  isVerified: boolean;
  avatar: Artwork;
}

export interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  genre: string | null;
  mood: string | null;
  playCount: number;
  favoriteCount: number;
  artwork: Artwork;
  artist: Artist;
}

export type TrendingPeriod = "week" | "month" | "year" | "allTime";
