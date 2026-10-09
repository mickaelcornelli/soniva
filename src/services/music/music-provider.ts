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
  /** Nombre maximum de résultats par type de contenu. */
  limit?: number;
}

/**
 * Contrat que tout provider musical doit respecter.
 * L'application ne dépend que de cette interface : remplacer Audius revient
 * à fournir une autre implémentation.
 *
 * Les méthodes de lecture unitaire renvoient `null` quand la ressource n'existe pas,
 * pour que les pages puissent afficher un 404 plutôt qu'une erreur.
 */
export interface MusicProvider {
  getTrendingTracks(query?: TrendingTracksQuery): Promise<Track[]>;
  getTrendingPlaylists(query?: TrendingQuery): Promise<Playlist[]>;
  getTrack(id: string): Promise<Track | null>;
  /** Plusieurs morceaux d'un coup, dans l'ordre des ids ; les ids introuvables sont ignorés. */
  getTracks(ids: readonly string[]): Promise<Track[]>;
  getArtistByHandle(handle: string): Promise<ArtistProfile | null>;
  /** Plusieurs artistes d'un coup, dans l'ordre des ids ; les ids introuvables sont ignorés. */
  getArtists(ids: readonly string[]): Promise<ArtistProfile[]>;
  /** Morceaux les plus écoutés de l'artiste. */
  getArtistTopTracks(artistId: string, query?: ArtistTracksQuery): Promise<Track[]>;
  /** Morceaux les plus récents de l'artiste. */
  getArtistLatestTracks(artistId: string, query?: ArtistTracksQuery): Promise<Track[]>;
  /** Artistes au style proche (calculé par le provider). */
  getRelatedArtists(artistId: string, query?: ArtistTracksQuery): Promise<ArtistProfile[]>;
  getPlaylist(id: string): Promise<Playlist | null>;
  getPlaylistTracks(id: string): Promise<Track[]>;
  /** Recherche de morceaux, d'artistes et de playlists. */
  search(query: string, options?: SearchQuery): Promise<SearchResults>;
  /** URL du flux audio d'un morceau, lisible directement par un élément <audio>. */
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
