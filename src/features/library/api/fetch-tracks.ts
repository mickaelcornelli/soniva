import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";

/** Limite de l'API /api/tracks par appel. */
const CHUNK_SIZE = 100;

/** Métadonnées de morceaux à partir de leurs identifiants (par paquets de 100). */
export async function fetchTracks(ids: readonly string[]): Promise<Track[]> {
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) chunks.push(ids.slice(i, i + CHUNK_SIZE));

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const response = await fetch(routes.tracksApi(chunk));
      if (!response.ok) throw new Error(`Morceaux indisponibles (${response.status}).`);
      return (await response.json()) as Track[];
    }),
  );
  return results.flat();
}
