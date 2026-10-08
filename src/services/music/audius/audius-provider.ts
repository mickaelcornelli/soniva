import { type MusicProvider, MusicProviderError } from "../music-provider";
import type { AudiusClient } from "./client";
import { parseTracks } from "./mappers";
import { audiusListResponseSchema } from "./schemas";

const DEFAULT_TRENDING_LIMIT = 20;
// Le classement Audius bouge peu à l'échelle de quelques minutes : un cache de 10 min
// limite fortement les appels (quota gratuit) sans fraîcheur perceptible en moins.
const TRENDING_REVALIDATE_SECONDS = 600;

function readList(json: unknown, path: string): unknown[] {
  const result = audiusListResponseSchema.safeParse(json);
  if (!result.success) {
    throw new MusicProviderError(`Format de réponse inattendu sur ${path}.`, {
      cause: result.error,
    });
  }
  return result.data.data;
}

export function createAudiusProvider(client: AudiusClient): MusicProvider {
  return {
    async getTrendingTracks({ period = "week", genre, limit = DEFAULT_TRENDING_LIMIT } = {}) {
      const path = "/tracks/trending";
      const json = await client.get(
        path,
        { time: period, genre, limit },
        { revalidate: TRENDING_REVALIDATE_SECONDS },
      );
      return parseTracks(readList(json, path));
    },
  };
}
