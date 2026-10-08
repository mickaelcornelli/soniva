export interface DiscoverApiQuery {
  genres: readonly string[];
  artistId?: string | undefined;
}

/** Chemins des pages publiques : un seul endroit à modifier si les URL changent. */
export const routes = {
  home: "/",
  search: "/search",
  searchFor: (query: string) => `/search?q=${encodeURIComponent(query)}`,
  library: "/library",
  /** Playlist personnelle (privée, hors SEO). */
  userPlaylist: (id: string) => `/library/playlists/${encodeURIComponent(id)}`,
  login: "/login",
  authCallback: "/auth/callback",
  track: (id: string) => `/track/${encodeURIComponent(id)}`,
  artist: (handle: string) => `/artist/${encodeURIComponent(handle)}`,
  playlist: (id: string) => `/playlist/${encodeURIComponent(id)}`,
  /** Flux audio servi par notre API (qui redirige vers le provider). */
  stream: (trackId: string) => `/api/stream/${encodeURIComponent(trackId)}`,
  /** Recherche JSON utilisée par la recherche instantanée. */
  searchApi: (query: string) => `/api/search?q=${encodeURIComponent(query)}`,
  /** Métadonnées de plusieurs morceaux, pour la bibliothèque. */
  tracksApi: (ids: readonly string[]) => `/api/tracks?ids=${ids.map(encodeURIComponent).join(",")}`,
  /** Recommandations à partir de quelques genres et d'un artiste de référence. */
  discoverApi: ({ genres, artistId }: DiscoverApiQuery) => {
    const params = new URLSearchParams({ genres: genres.join(",") });
    if (artistId) params.set("artist", artistId);
    return `/api/discover?${params.toString()}`;
  },
  /** Morceaux proches d'un artiste (et d'un genre), pour prolonger la file. */
  radioApi: ({ artistId, genre }: { artistId: string; genre?: string | null | undefined }) => {
    const params = new URLSearchParams({ artist: artistId });
    if (genre) params.set("genre", genre);
    return `/api/radio?${params.toString()}`;
  },
} as const;
