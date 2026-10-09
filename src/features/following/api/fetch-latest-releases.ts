import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";

export async function fetchLatestReleases(
  artistIds: readonly string[],
  signal?: AbortSignal,
): Promise<Track[]> {
  const response = await fetch(routes.releasesApi(artistIds), { signal });
  if (!response.ok) throw new Error(`Nouveautés indisponibles (${response.status}).`);
  return (await response.json()) as Track[];
}
