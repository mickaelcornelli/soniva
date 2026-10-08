import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";

export async function fetchRadioTracks(
  seed: { artistId: string; genre: string | null },
  signal?: AbortSignal,
): Promise<Track[]> {
  const response = await fetch(routes.radioApi(seed), { signal });
  if (!response.ok) throw new Error(`Radio indisponible (${response.status}).`);
  return (await response.json()) as Track[];
}
