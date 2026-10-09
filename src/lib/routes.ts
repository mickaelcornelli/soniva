import { DEFAULT_TRENDING_PERIOD } from "@/lib/trending-period";
import type { TrendingPeriod } from "@/types/music";

export interface DiscoverApiQuery {
  genres: readonly string[];
  artistId?: string | undefined;
}

/** Single place to change if URLs change. */
export const routes = {
  home: "/",
  search: "/search",
  searchFor: (query: string) => `/search?q=${encodeURIComponent(query)}`,
  library: "/library",
  libraryStats: (period: "current" | "previous" = "current") =>
    period === "current" ? "/library/stats" : "/library/stats?month=previous",
  userPlaylist: (id: string) => `/library/playlists/${encodeURIComponent(id)}`,
  login: "/login",
  about: "/about",
  jobs: "/jobs",
  reviews: "/reviews",
  help: "/help",
  contact: "/contact",
  /** Info page for artists (not `artist`, an artist's page). */
  forArtists: "/artists",
  credits: "/credits",
  /** `/sitemap` is avoided so it isn't confused with `sitemap.xml`. */
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
  /** The default period (week) is omitted from the URL. */
  genre: (slug: string, period: TrendingPeriod = DEFAULT_TRENDING_PERIOD) =>
    period === DEFAULT_TRENDING_PERIOD
      ? `/genres/${encodeURIComponent(slug)}`
      : `/genres/${encodeURIComponent(slug)}?period=${period}`,
  /** Served by our API, which redirects to the provider. */
  stream: (trackId: string) => `/api/stream/${encodeURIComponent(trackId)}`,
  searchApi: (query: string) => `/api/search?q=${encodeURIComponent(query)}`,
  tracksApi: (ids: readonly string[]) => `/api/tracks?ids=${ids.map(encodeURIComponent).join(",")}`,
  artistsApi: (ids: readonly string[]) =>
    `/api/artists?ids=${ids.map(encodeURIComponent).join(",")}`,
  releasesApi: (artistIds: readonly string[]) =>
    `/api/releases?artists=${artistIds.map(encodeURIComponent).join(",")}`,
  discoverApi: ({ genres, artistId }: DiscoverApiQuery) => {
    const params = new URLSearchParams({ genres: genres.join(",") });
    if (artistId) params.set("artist", artistId);
    return `/api/discover?${params.toString()}`;
  },
  radioApi: ({ artistId, genre }: { artistId: string; genre?: string | null | undefined }) => {
    const params = new URLSearchParams({ artist: artistId });
    if (genre) params.set("genre", genre);
    return `/api/radio?${params.toString()}`;
  },
} as const;
