import type { ArtistProfile, Playlist, SearchResults, Track, TrendingPeriod } from "@/types/music";

export interface TrendingQuery {
  period?: TrendingPeriod;
  limit?: number;
}

export interface TrendingTracksQuery extends TrendingQuery {
  genre?: string;
}

export interface ArtistTracksQuery {
  limit?: number;
}

export interface SearchQuery {
  limit?: number;
}

/**
 * The app depends only on this interface: replacing Audius means
 * providing another implementation. Single-item getters return `null`
 * for missing resources so pages can render a 404 rather than an error.
 */
export interface MusicProvider {
  getTrendingTracks(query?: TrendingTracksQuery): Promise<Track[]>;
  getTrendingPlaylists(query?: TrendingQuery): Promise<Playlist[]>;
  getTrack(id: string): Promise<Track | null>;
  /** In ID order; unknown IDs are skipped. */
  getTracks(ids: readonly string[]): Promise<Track[]>;
  getArtistByHandle(handle: string): Promise<ArtistProfile | null>;
  /** In ID order; unknown IDs are skipped. */
  getArtists(ids: readonly string[]): Promise<ArtistProfile[]>;
  getArtistTopTracks(artistId: string, query?: ArtistTracksQuery): Promise<Track[]>;
  getArtistLatestTracks(artistId: string, query?: ArtistTracksQuery): Promise<Track[]>;
  /** Computed by the provider. */
  getRelatedArtists(artistId: string, query?: ArtistTracksQuery): Promise<ArtistProfile[]>;
  getPlaylist(id: string): Promise<Playlist | null>;
  getPlaylistTracks(id: string): Promise<Track[]>;
  search(query: string, options?: SearchQuery): Promise<SearchResults>;
  /** Playable directly by an <audio> element. */
  getStreamUrl(trackId: string): string;
}

export class MusicProviderError extends Error {
  readonly status: number | undefined;

  constructor(message: string, options: { status?: number; cause?: unknown } = {}) {
    super(message, { cause: options.cause });
    this.name = "MusicProviderError";
    this.status = options.status;
  }
}
