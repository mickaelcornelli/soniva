import type { MetadataRoute } from "next";
import { GENRES } from "@/lib/genres";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { loadOptional } from "@/lib/load-optional";
import { routes } from "@/lib/routes";
import { musicProvider } from "@/services/music";

// The Audius catalogue is too large to list: expose
// static pages and current trends, refreshed hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tracks, playlists] = await Promise.all([
    loadOptional(() => musicProvider.getTrendingTracks({ limit: 50 }), [], "sitemap"),
    loadOptional(() => musicProvider.getTrendingPlaylists({ limit: 20 }), [], "sitemap"),
  ]);

  const artistHandles = new Set(tracks.map((track) => track.artist.handle));

  return [
    { url: absoluteUrl(routes.home), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl(routes.search), changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl(routes.genres), changeFrequency: "monthly", priority: 0.6 },
    // Fictional jobs and reviews are noindex, so they are left out.
    ...[
      routes.about,
      routes.forArtists,
      routes.help,
      routes.trust,
      routes.legal,
      routes.terms,
      routes.privacy,
      routes.cookies,
      routes.accessibility,
      routes.report,
      routes.contact,
      routes.credits,
      routes.siteMap,
    ].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...GENRES.map((genre) => ({
      url: absoluteUrl(routes.genre(genre.slug)),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...tracks.map((track) => ({
      url: absoluteUrl(routes.track(track.id)),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...[...artistHandles].map((handle) => ({
      url: absoluteUrl(routes.artist(handle)),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...playlists.map((playlist) => ({
      url: absoluteUrl(routes.playlist(playlist.id)),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
