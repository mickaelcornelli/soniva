// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { MusicProviderError } from "../music-provider";
import { buildAudiusUrl, createAudiusClient } from "./client";

const baseConfig = { baseUrl: "https://api.audius.co/v1/", appName: "Soniva" };

describe("buildAudiusUrl", () => {
  it("ajoute app_name, api_key et ignore les paramètres vides", () => {
    const url = buildAudiusUrl({ ...baseConfig, apiKey: "pk_123" }, "/tracks/trending", {
      time: "week",
      genre: undefined,
      limit: 20,
      mood: "",
    });

    expect(url.origin + url.pathname).toBe("https://api.audius.co/v1/tracks/trending");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      time: "week",
      limit: "20",
      app_name: "Soniva",
      api_key: "pk_123",
    });
  });

  it("n'envoie pas api_key quand aucune clé n'est configurée", () => {
    const url = buildAudiusUrl(baseConfig, "/tracks/trending");

    expect(url.searchParams.has("api_key")).toBe(false);
  });
});

describe("createAudiusClient", () => {
  it("renvoie le JSON et transmet le bearer token en en-tête", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ data: [] }));
    const client = createAudiusClient({ ...baseConfig, bearerToken: "secret", fetch: fetchMock });

    await expect(client.get("/tracks/trending")).resolves.toEqual({ data: [] });

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.headers).toMatchObject({ Authorization: "Bearer secret" });
  });

  it("lève une MusicProviderError avec le statut HTTP en cas d'échec", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    const client = createAudiusClient({ ...baseConfig, fetch: fetchMock });

    const error = await client.get("/tracks/trending").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(MusicProviderError);
    expect((error as MusicProviderError).status).toBe(503);
  });

  it("lève une MusicProviderError quand le réseau échoue", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("fetch failed"));
    const client = createAudiusClient({ ...baseConfig, fetch: fetchMock });

    await expect(client.get("/tracks/trending")).rejects.toBeInstanceOf(MusicProviderError);
  });
});
