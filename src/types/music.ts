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

/** Fiche complète d'un artiste, pour sa page publique. */
export interface ArtistProfile extends Artist {
  bio: string | null;
  location: string | null;
  cover: Artwork;
  followerCount: number;
  trackCount: number;
  playlistCount: number;
}

export interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  genre: string | null;
  mood: string | null;
  description: string | null;
  tags: string[];
  /** Date ISO (AAAA-MM-JJ…) ou null si inconnue. */
  releaseDate: string | null;
  playCount: number;
  favoriteCount: number;
  artwork: Artwork;
  artist: Artist;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  isAlbum: boolean;
  artwork: Artwork;
  owner: Artist;
  trackCount: number;
  favoriteCount: number;
  playCount: number;
}

/** Résultats d'une recherche, regroupés par type de contenu. */
export interface SearchResults {
  tracks: Track[];
  artists: ArtistProfile[];
  playlists: Playlist[];
}

export type TrendingPeriod = "week" | "month" | "year" | "allTime";
