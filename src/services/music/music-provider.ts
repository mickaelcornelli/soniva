import type { Track, TrendingPeriod } from "@/types/music";

export interface TrendingTracksQuery {
  period?: TrendingPeriod;
  genre?: string;
  limit?: number;
}

/**
 * Contrat que tout provider musical doit respecter.
 * L'application ne dépend que de cette interface : remplacer Audius revient
 * à fournir une autre implémentation.
 */
export interface MusicProvider {
  getTrendingTracks(query?: TrendingTracksQuery): Promise<Track[]>;
}

export class MusicProviderError extends Error {
  readonly status: number | undefined;

  constructor(message: string, options: { status?: number; cause?: unknown } = {}) {
    super(message, { cause: options.cause });
    this.name = "MusicProviderError";
    this.status = options.status;
  }
}
