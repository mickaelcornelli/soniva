import { MusicProviderError } from "../music-provider";

const REQUEST_TIMEOUT_MS = 8_000;

export interface AudiusClientConfig {
  baseUrl: string;
  appName: string;
  apiKey?: string | undefined;
  /** Secret : à n'utiliser que côté serveur. */
  bearerToken?: string | undefined;
  fetch?: typeof fetch;
}

export type QueryParams = Record<string, string | number | undefined>;

export interface RequestOptions {
  /** Durée de cache côté Next.js, en secondes. */
  revalidate?: number;
}

export interface AudiusClient {
  get(path: string, params?: QueryParams, options?: RequestOptions): Promise<unknown>;
  /** URL complète (identifiants inclus) d'une ressource lue directement par le navigateur. */
  url(path: string, params?: QueryParams): URL;
}

export function buildAudiusUrl(config: AudiusClientConfig, path: string, params: QueryParams = {}) {
  const url = new URL(`${config.baseUrl.replace(/\/+$/, "")}${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  // Identifiants attendus par Audius sur chaque requête (cf. SDK officiel).
  url.searchParams.set("app_name", config.appName);
  if (config.apiKey) url.searchParams.set("api_key", config.apiKey);

  return url;
}

export function createAudiusClient(config: AudiusClientConfig): AudiusClient {
  const fetchImpl = config.fetch ?? fetch;

  return {
    url(path, params) {
      return buildAudiusUrl(config, path, params);
    },

    async get(path, params, options = {}) {
      const url = buildAudiusUrl(config, path, params);
      const headers: Record<string, string> = { Accept: "application/json" };
      if (config.bearerToken) headers.Authorization = `Bearer ${config.bearerToken}`;

      let response: Response;
      try {
        response = await fetchImpl(url, {
          headers,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          next: { revalidate: options.revalidate },
        });
      } catch (cause) {
        throw new MusicProviderError("Audius est injoignable.", { cause });
      }

      if (!response.ok) {
        throw new MusicProviderError(`Audius a répondu ${response.status} sur ${path}.`, {
          status: response.status,
        });
      }

      try {
        return (await response.json()) as unknown;
      } catch (cause) {
        throw new MusicProviderError("Réponse Audius illisible.", { cause });
      }
    },
  };
}
