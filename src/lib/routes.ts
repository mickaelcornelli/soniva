import { DEFAULT_TRENDING_PERIOD } from "@/lib/trending-period";
import type { TrendingPeriod } from "@/types/music";

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
  /** « Ton mois en musique » ; le mois précédent via `previous`. */
  libraryStats: (period: "current" | "previous" = "current") =>
    period === "current" ? "/library/stats" : "/library/stats?month=previous",
  /** Playlist personnelle (privée, hors SEO). */
  userPlaylist: (id: string) => `/library/playlists/${encodeURIComponent(id)}`,
  login: "/login",
  about: "/about",
  jobs: "/jobs",
  reviews: "/reviews",
  help: "/help",
  contact: "/contact",
  /** Page d'information destinée aux artistes (≠ `artist`, la page d'un artiste). */
  forArtists: "/artists",
  credits: "/credits",
  /** Plan du site lisible ; `/sitemap` est évité pour ne pas se confondre avec `sitemap.xml`. */
  siteMap: "/plan-du-site",
  legal: "/legal",
  privacy: "/privacy",
  cookies: "/cookies",
  cookieSettings: "/cookies/settings",
  trust: "/trust",
  accessibility: "/accessibility",
  terms: "/terms",
  report: "/report",
  authCallback: "/auth/callback",
  track: (id: string) => `/track/${encodeURIComponent(id)}`,
  artist: (handle: string) => `/artist/${encodeURIComponent(handle)}`,
  playlist: (id: string) => `/playlist/${encodeURIComponent(id)}`,
  genres: "/genres",
  /** Page d'un genre ; la période par défaut (semaine) n'apparaît pas dans l'URL. */
  genre: (slug: string, period: TrendingPeriod = DEFAULT_TRENDING_PERIOD) =>
    period === DEFAULT_TRENDING_PERIOD
      ? `/genres/${encodeURIComponent(slug)}`
      : `/genres/${encodeURIComponent(slug)}?period=${period}`,
  /** Flux audio servi par notre API (qui redirige vers le provider). */
  stream: (trackId: string) => `/api/stream/${encodeURIComponent(trackId)}`,
  /** Recherche JSON utilisée par la recherche instantanée. */
  searchApi: (query: string) => `/api/search?q=${encodeURIComponent(query)}`,
  /** Métadonnées de plusieurs morceaux, pour la bibliothèque. */
  tracksApi: (ids: readonly string[]) => `/api/tracks?ids=${ids.map(encodeURIComponent).join(",")}`,
  /** Fiches de plusieurs artistes, pour les artistes suivis. */
  artistsApi: (ids: readonly string[]) =>
    `/api/artists?ids=${ids.map(encodeURIComponent).join(",")}`,
  /** Derniers morceaux d'une liste d'artistes. */
  releasesApi: (artistIds: readonly string[]) =>
    `/api/releases?artists=${artistIds.map(encodeURIComponent).join(",")}`,
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
