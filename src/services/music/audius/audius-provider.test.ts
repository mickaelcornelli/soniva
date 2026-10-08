import { describe, expect, it, vi } from "vitest";
import { MusicProviderError } from "../music-provider";
import { createAudiusProvider } from "./audius-provider";
import type { AudiusClient } from "./client";
import { makeAudiusTrack } from "./fixtures";

function makeClient(response: unknown): AudiusClient {
  return { get: vi.fn().mockResolvedValue(response) };
}

describe("AudiusProvider.getTrendingTracks", () => {
  it("interroge les tendances de la semaine par défaut", async () => {
    const client = makeClient({ data: [makeAudiusTrack()] });

    const tracks = await createAudiusProvider(client).getTrendingTracks();

    expect(tracks).toHaveLength(1);
    expect(client.get).toHaveBeenCalledWith(
      "/tracks/trending",
      { time: "week", genre: undefined, limit: 20 },
      expect.objectContaining({ revalidate: expect.any(Number) }),
    );
  });

  it("transmet la période, le genre et la limite demandés", async () => {
    const client = makeClient({ data: [] });

    await createAudiusProvider(client).getTrendingTracks({
      period: "month",
      genre: "Hip-Hop/Rap",
      limit: 5,
    });

    expect(client.get).toHaveBeenCalledWith(
      "/tracks/trending",
      { time: "month", genre: "Hip-Hop/Rap", limit: 5 },
      expect.anything(),
    );
  });

  it("lève une MusicProviderError si l'enveloppe de réponse est invalide", async () => {
    const client = makeClient({ unexpected: true });

    await expect(createAudiusProvider(client).getTrendingTracks()).rejects.toBeInstanceOf(
      MusicProviderError,
    );
  });
});
