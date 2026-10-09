import type { ArtistProfile, Track } from "@/types/music";

export interface GenreRecommendation {
  genre: string;
  tracks: Track[];
}

export interface Recommendations {
  genres: GenreRecommendation[];
  relatedArtists: ArtistProfile[];
}
