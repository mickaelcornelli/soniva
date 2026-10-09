import { describe, expect, it, vi } from "vitest";
import type { MusicProvider } from "@/services/music/music-provider";
import { makeTrack } from "@/test/factories";
import { getLatestReleases } from "./get-latest-releases";

function makeProvider(tracksByArtist: Record<string, ReturnType<typeof makeTrack>[]>) {
  return {
    getArtistLatestTracks: vi.fn((artistId: string) =>
      tracksByArtist[artistId]
        ? Promise.resolve(tracksByArtist[artistId])
        : Promise.reject(new Error("indisponible")),
    ),
  } as unknown as MusicProvider;
}

describe("getLatestReleases", () => {
  it("fusionne les morceaux des artistes, du plus récent au plus ancien", async () => {
    const provider = makeProvider({
      a: [
        makeTrack({ id: "a1", releaseDate: "2026-10-01" }),
        makeTrack({ id: "old", releaseDate: null }),
      ],
      b: [makeTrack({ id: "b1", releaseDate: "2026-10-05" })],
    });

    const tracks = await getLatestReleases(provider, ["a", "b"], 10);

    expect(tracks.map((t) => t.id)).toEqual(["b1", "a1", "old"]);
  });

  it("ignore un artiste indisponible et respecte la limite", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const provider = makeProvider({
      a: [
        makeTrack({ id: "a1", releaseDate: "2026-10-01" }),
        makeTrack({ id: "a2", releaseDate: "2026-09-01" }),
      ],
    });

    const tracks = await getLatestReleases(provider, ["a", "panne"], 1);

    expect(tracks.map((t) => t.id)).toEqual(["a1"]);
  });
});
