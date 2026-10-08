import { type MusicProvider, MusicProviderError } from "../music-provider";
import type { AudiusClient, QueryParams } from "./client";
import {
  parseArtistProfile,
  parseArtistProfiles,
  parsePlaylist,
  parsePlaylists,
  parseTrack,
  parseTracks,
} from "./mappers";
import { audiusItemResponseSchema, audiusListResponseSchema } from "./schemas";

const DEFAULT_TRENDING_LIMIT = 20;
const DEFAULT_TRENDING_PLAYLISTS_LIMIT = 10;
const DEFAULT_ARTIST_TRACKS_LIMIT = 10;
const DEFAULT_SEARCH_LIMIT = 10;
const DEFAULT_RELATED_ARTISTS_LIMIT = 6;

/*
 * Durées de cache (secondes). Les classements bougent peu à l'échelle de quelques minutes
 * et les fiches (morceau, artiste) presque jamais : des caches longs ménagent le quota
 * gratuit d'Audius sans fraîcheur perceptible en moins.
 */
const CACHE = {
  trending: 600,
  detail: 3600,
  list: 900,
  search: 300,
} as const;

/** Audius répond 404 pour un id inconnu et 400 pour un id mal formé : dans les deux cas, la ressource n'existe pas. */
const NOT_FOUND_STATUSES = new Set([400, 404]);

function isNotFound(error: unknown): boolean {
  return error instanceof MusicProviderError && NOT_FOUND_STATUSES.has(error.status ?? 0);
}

export function createAudiusProvider(client: AudiusClient): MusicProvider {
  async function getList(path: string, params: QueryParams, revalidate: number) {
    const json = await client.get(path, params, { revalidate });
    const result = audiusListResponseSchema.safeParse(json);
    if (!result.success) {
      throw new MusicProviderError(`Format de réponse inattendu sur ${path}.`, {
        cause: result.error,
      });
    }
    return result.data.data;
  }

  /** Renvoie `undefined` quand la ressource n'existe pas. */
  async function getItem(path: string, revalidate: number): Promise<unknown> {
    try {
      const json = await client.get(path, {}, { revalidate });
      const result = audiusItemResponseSchema.safeParse(json);
      if (!result.success) {
        throw new MusicProviderError(`Format de réponse inattendu sur ${path}.`, {
          cause: result.error,
        });
      }
      return result.data.data;
    } catch (error) {
      if (isNotFound(error)) return undefined;
      throw error;
    }
  }

  const encode = encodeURIComponent;

  return {
    async getTrendingTracks({ period = "week", genre, limit = DEFAULT_TRENDING_LIMIT } = {}) {
      const items = await getList(
        "/tracks/trending",
        { time: period, genre, limit },
        CACHE.trending,
      );
      return parseTracks(items);
    },

    async getTrendingPlaylists({ period = "week", limit = DEFAULT_TRENDING_PLAYLISTS_LIMIT } = {}) {
      const items = await getList(
        "/playlists/trending",
        { time: period, limit, type: "playlist", omit_tracks: "true" },
        CACHE.trending,
      );
      return parsePlaylists(items);
    },

    async getTrack(id) {
      return parseTrack(await getItem(`/tracks/${encode(id)}`, CACHE.detail));
    },

    async getTracks(ids) {
      if (ids.length === 0) return [];
      const tracks = parseTracks(await getList("/tracks", { id: ids }, CACHE.detail));
      const byId = new Map(tracks.map((track) => [track.id, track]));
      return ids.flatMap((id) => byId.get(id) ?? []);
    },

    async getArtistByHandle(handle) {
      return parseArtistProfile(await getItem(`/users/handle/${encode(handle)}`, CACHE.detail));
    },

    async getArtistTopTracks(artistId, { limit = DEFAULT_ARTIST_TRACKS_LIMIT } = {}) {
      const items = await getList(
        `/users/${encode(artistId)}/tracks`,
        { sort: "plays", limit },
        CACHE.list,
      );
      return parseTracks(items);
    },

    async getRelatedArtists(artistId, { limit = DEFAULT_RELATED_ARTISTS_LIMIT } = {}) {
      const items = await getList(`/users/${encode(artistId)}/related`, { limit }, CACHE.detail);
      return parseArtistProfiles(items);
    },

    async getPlaylist(id) {
      // Audius renvoie une playlist unitaire dans un tableau : `{ data: [playlist] }`.
      const data = await getItem(`/playlists/${encode(id)}`, CACHE.detail);
      return parsePlaylist(Array.isArray(data) ? data[0] : data);
    },

    async getPlaylistTracks(id) {
      try {
        return parseTracks(await getList(`/playlists/${encode(id)}/tracks`, {}, CACHE.list));
      } catch (error) {
        // Playlist inexistante : la page affichera son 404 via getPlaylist.
        if (isNotFound(error)) return [];
        throw error;
      }
    },

    async search(query, { limit = DEFAULT_SEARCH_LIMIT } = {}) {
      const params = { query: query.trim(), limit };
      const [tracks, artists, playlists] = await Promise.all([
        getList("/tracks/search", params, CACHE.search),
        getList("/users/search", params, CACHE.search),
        getList("/playlists/search", params, CACHE.search),
      ]);
      return {
        tracks: parseTracks(tracks),
        artists: parseArtistProfiles(artists),
        playlists: parsePlaylists(playlists),
      };
    },

    getStreamUrl(trackId) {
      // Audius répond par une redirection vers le nœud de stockage qui sert l'audio.
      return client.url(`/tracks/${encode(trackId)}/stream`).toString();
    },
  };
}
