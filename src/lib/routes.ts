/** Chemins des pages publiques : un seul endroit à modifier si les URL changent. */
export const routes = {
  home: "/",
  search: "/search",
  library: "/library",
  track: (id: string) => `/track/${encodeURIComponent(id)}`,
  artist: (handle: string) => `/artist/${encodeURIComponent(handle)}`,
  playlist: (id: string) => `/playlist/${encodeURIComponent(id)}`,
} as const;
