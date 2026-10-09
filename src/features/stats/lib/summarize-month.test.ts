import { describe, expect, it } from "vitest";
import { type ListeningRow, summarizeMonth } from "./summarize-month";

const row = (overrides: Partial<ListeningRow>): ListeningRow => ({
  trackId: "t",
  artistId: "a",
  genre: "House",
  plays: 1,
  seconds: 100,
  ...overrides,
});

describe("summarizeMonth", () => {
  const rows = [
    row({ trackId: "t1", artistId: "a1", genre: "House", plays: 3, seconds: 600 }),
    row({ trackId: "t2", artistId: "a1", genre: "House", plays: 1, seconds: 200 }),
    row({ trackId: "t3", artistId: "a2", genre: "Jazz", plays: 5, seconds: 700 }),
    row({ trackId: "t4", artistId: "a3", genre: null, plays: 1, seconds: 100 }),
  ];

  it("calcule les totaux", () => {
    expect(summarizeMonth(rows)).toMatchObject({
      totalSeconds: 1600,
      totalPlays: 10,
      trackCount: 4,
      artistCount: 3,
    });
  });

  it("classe morceaux et artistes au temps d'écoute", () => {
    const summary = summarizeMonth(rows, 2);

    expect(summary.topTracks.map((t) => t.trackId)).toEqual(["t3", "t1"]);
    expect(summary.topArtists).toEqual([
      { artistId: "a1", plays: 4, seconds: 800 },
      { artistId: "a2", plays: 5, seconds: 700 },
    ]);
  });

  it("calcule la part de chaque genre sur le temps des morceaux qui en ont un", () => {
    const { topGenres } = summarizeMonth(rows);

    expect(topGenres.map((g) => g.genre)).toEqual(["House", "Jazz"]);
    expect(topGenres[0]?.share).toBeCloseTo(800 / 1500);
  });

  it("départage deux morceaux à temps égal par le nombre d'écoutes", () => {
    const { topTracks } = summarizeMonth([
      row({ trackId: "x", seconds: 300, plays: 1 }),
      row({ trackId: "y", seconds: 300, plays: 2 }),
    ]);

    expect(topTracks.map((t) => t.trackId)).toEqual(["y", "x"]);
  });

  it("gère un mois vide", () => {
    expect(summarizeMonth([])).toMatchObject({ totalSeconds: 0, topGenres: [] });
  });
});
