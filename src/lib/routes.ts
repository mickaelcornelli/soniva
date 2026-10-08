/** Chemins des pages publiques : un seul endroit à modifier si les URL changent. */
export const routes = {
  home: "/",
  search: "/search",
  searchFor: (query: string) => `/search?q=${encodeURIComponent(query)}`,
  library: "/library",
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
} as const;
