import "server-only";
import { serverEnv } from "@/config/env";
import { createAudiusProvider } from "./audius/audius-provider";
import { createAudiusClient } from "./audius/client";
import type { MusicProvider } from "./music-provider";

/** Provider musical de l'application. Changer de provider se fait ici uniquement. */
export const musicProvider: MusicProvider = createAudiusProvider(
  createAudiusClient({
    baseUrl: serverEnv.AUDIUS_API_BASE_URL,
    appName: serverEnv.AUDIUS_APP_NAME,
    apiKey: serverEnv.AUDIUS_API_KEY,
    bearerToken: serverEnv.AUDIUS_BEARER_TOKEN,
  }),
);

export { MusicProviderError } from "./music-provider";
export type { MusicProvider, TrendingTracksQuery } from "./music-provider";
