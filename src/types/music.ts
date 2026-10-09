/** Provider-agnostic domain types: components and hooks never see raw Audius responses. */

export type ArtworkSize = "small" | "medium" | "large";

/** A size may be missing depending on the provider. */
export type Artwork = Partial<Record<ArtworkSize, string>>;

export interface Artist {
  id: string;
  name: string;
  handle: string;
  isVerified: boolean;
  avatar: Artwork;
}

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
  /** ISO date (YYYY-MM-DD…) or null if unknown. */
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

export interface SearchResults {
  tracks: Track[];
  artists: ArtistProfile[];
  playlists: Playlist[];
}

export type TrendingPeriod = "week" | "month" | "year" | "allTime";
