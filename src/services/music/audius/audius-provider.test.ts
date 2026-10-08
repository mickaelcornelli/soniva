import { describe, expect, it, vi } from "vitest";
import { MusicProviderError } from "../music-provider";
import { createAudiusProvider } from "./audius-provider";
import type { AudiusClient } from "./client";
import { makeAudiusPlaylist, makeAudiusTrack, makeAudiusUserProfile } from "./fixtures";

function makeClient(response: unknown): AudiusClient {
  return { get: vi.fn().mockResolvedValue(response) };
}

function makeFailingClient(status: number): AudiusClient {
  return { get: vi.fn().mockRejectedValue(new MusicProviderError("échec", { status })) };
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

describe("AudiusProvider.getTrack", () => {
  it("renvoie le morceau demandé", async () => {
    const client = makeClient({ data: makeAudiusTrack() });

    const track = await createAudiusProvider(client).getTrack("D7KyD");

    expect(track?.title).toBe("Night Drive");
    expect(client.get).toHaveBeenCalledWith("/tracks/D7KyD", {}, expect.anything());
  });

  it.each([400, 404])("renvoie null quand Audius répond %s", async (status) => {
    await expect(createAudiusProvider(makeFailingClient(status)).getTrack("x")).resolves.toBeNull();
  });

  it("propage les autres erreurs", async () => {
    await expect(createAudiusProvider(makeFailingClient(503)).getTrack("x")).rejects.toBeInstanceOf(
      MusicProviderError,
    );
  });

  it("encode l'identifiant dans l'URL", async () => {
    const client = makeClient({ data: makeAudiusTrack() });

    await createAudiusProvider(client).getTrack("a/b");

    expect(client.get).toHaveBeenCalledWith("/tracks/a%2Fb", {}, expect.anything());
  });
});

describe("AudiusProvider.getArtistByHandle / getArtistTopTracks", () => {
  it("récupère l'artiste par son handle", async () => {
    const client = makeClient({ data: makeAudiusUserProfile() });

    const artist = await createAudiusProvider(client).getArtistByHandle("lunerouge");

    expect(artist?.followerCount).toBe(5_200);
    expect(client.get).toHaveBeenCalledWith("/users/handle/lunerouge", {}, expect.anything());
  });

  it("trie les morceaux de l'artiste par écoutes", async () => {
    const client = makeClient({ data: [makeAudiusTrack()] });

    await createAudiusProvider(client).getArtistTopTracks("nlGNe", { limit: 5 });

    expect(client.get).toHaveBeenCalledWith(
      "/users/nlGNe/tracks",
      { sort: "plays", limit: 5 },
      expect.anything(),
    );
  });
});

describe("AudiusProvider playlists", () => {
  it("déballe la playlist renvoyée dans un tableau", async () => {
    const client = makeClient({ data: [makeAudiusPlaylist()] });

    const playlist = await createAudiusProvider(client).getPlaylist("pl9X2");

    expect(playlist?.name).toBe("Routes de nuit");
  });

  it("renvoie null pour une playlist introuvable", async () => {
    const client = makeClient({ data: [] });

    await expect(createAudiusProvider(client).getPlaylist("nope")).resolves.toBeNull();
  });

  it("demande les playlists tendance sans leurs morceaux", async () => {
    const client = makeClient({ data: [makeAudiusPlaylist()] });

    const playlists = await createAudiusProvider(client).getTrendingPlaylists({ limit: 4 });

    expect(playlists).toHaveLength(1);
    expect(client.get).toHaveBeenCalledWith(
      "/playlists/trending",
      { time: "week", limit: 4, type: "playlist", omit_tracks: "true" },
      expect.anything(),
    );
  });

  it("renvoie une liste vide de morceaux pour une playlist introuvable", async () => {
    await expect(
      createAudiusProvider(makeFailingClient(404)).getPlaylistTracks("nope"),
    ).resolves.toEqual([]);
  });
});
