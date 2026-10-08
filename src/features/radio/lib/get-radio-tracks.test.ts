import { describe, expect, it, vi } from "vitest";
import type { MusicProvider } from "@/services/music/music-provider";
import { makeArtistProfile, makeTrack } from "@/test/factories";
import { getRadioTracks } from "./get-radio-tracks";

function makeProvider(overrides: Partial<MusicProvider>): MusicProvider {
  return {
    getTrendingTracks: vi.fn().mockResolvedValue([makeTrack({ id: "genre" })]),
    getRelatedArtists: vi.fn().mockResolvedValue([makeArtistProfile({ id: "r1" })]),
    getArtistTopTracks: vi.fn().mockResolvedValue([makeTrack({ id: "proche" })]),
    ...overrides,
  } as unknown as MusicProvider;
}

describe("getRadioTracks", () => {
  it("combine titres d'artistes proches et tendances du genre", async () => {
    const provider = makeProvider({});

    const tracks = await getRadioTracks(provider, { genre: "House", artistId: "a1" });

    expect(tracks.map((t) => t.id)).toEqual(["proche", "genre"]);
    expect(provider.getArtistTopTracks).toHaveBeenCalledWith("r1", expect.anything());
  });

  it("se passe du genre quand il est inconnu", async () => {
    const provider = makeProvider({});

    await getRadioTracks(provider, { artistId: "a1" });

    expect(provider.getTrendingTracks).not.toHaveBeenCalled();
  });

  it("continue avec les autres sources si l'une échoue", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const provider = makeProvider({
      getRelatedArtists: vi.fn().mockRejectedValue(new Error("indisponible")),
    });

    const tracks = await getRadioTracks(provider, { genre: "House", artistId: "a1" });

    expect(tracks.map((t) => t.id)).toEqual(["genre"]);
  });
});
