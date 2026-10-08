import { type DiscoverApiQuery, routes } from "@/lib/routes";
import type { Recommendations } from "../types";

export async function fetchRecommendations(
  query: DiscoverApiQuery,
  signal?: AbortSignal,
): Promise<Recommendations> {
  const response = await fetch(routes.discoverApi(query), { signal });
  if (!response.ok) throw new Error(`Recommandations indisponibles (${response.status}).`);
  return (await response.json()) as Recommendations;
}
