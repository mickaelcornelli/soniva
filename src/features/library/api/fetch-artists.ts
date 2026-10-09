import { routes } from "@/lib/routes";
import type { ArtistProfile } from "@/types/music";

/** Limite de l'API /api/artists par appel. */
const CHUNK_SIZE = 100;

/** Fiches d'artistes à partir de leurs identifiants (par paquets de 100). */
export async function fetchArtists(ids: readonly string[]): Promise<ArtistProfile[]> {
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) chunks.push(ids.slice(i, i + CHUNK_SIZE));

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const response = await fetch(routes.artistsApi(chunk));
      if (!response.ok) throw new Error(`Artistes indisponibles (${response.status}).`);
      return (await response.json()) as ArtistProfile[];
    }),
  );
  return results.flat();
}
