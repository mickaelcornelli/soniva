import { describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { buildFavorites, buildHistory, planFavoritesSync } from "./library-sync-plan";

const tracks = new Map(["a", "b", "c"].map((id) => [id, makeTrack({ id })]));

describe("planFavoritesSync", () => {
  it("sépare ce qui est à envoyer et ce qui manque localement", () => {
    const local = [
      { track: makeTrack({ id: "a" }), addedAt: "2026-10-01T00:00:00Z" },
      { track: makeTrack({ id: "b" }), addedAt: "2026-10-02T00:00:00Z" },
    ];
    const remote = [
      { trackId: "b", addedAt: "2026-09-01T00:00:00Z" },
      { trackId: "c", addedAt: "2026-09-02T00:00:00Z" },
    ];

    expect(planFavoritesSync(local, remote)).toEqual({
      toUpload: [{ trackId: "a", addedAt: "2026-10-01T00:00:00Z" }],
      missingIds: ["c"],
    });
  });
});

describe("buildFavorites", () => {
  it("trie du plus récent au plus ancien et ignore les morceaux inconnus", () => {
    const favorites = buildFavorites(
      [
        { trackId: "a", addedAt: "2026-10-01T00:00:00Z" },
        { trackId: "zzz", addedAt: "2026-10-05T00:00:00Z" },
        { trackId: "b", addedAt: "2026-10-03T00:00:00Z" },
      ],
      tracks,
    );

    expect(favorites.map((f) => f.track.id)).toEqual(["b", "a"]);
  });
});

describe("buildHistory", () => {
  it("garde la dernière écoute de chaque morceau, marquée synchronisée", () => {
    const history = buildHistory(
      [
        { trackId: "a", playedAt: "2026-10-01T10:00:00Z" },
        { trackId: "b", playedAt: "2026-10-01T11:00:00Z" },
        { trackId: "a", playedAt: "2026-10-01T12:00:00Z" },
      ],
      tracks,
    );

    expect(history.map((h) => [h.track.id, h.playedAt])).toEqual([
      ["a", "2026-10-01T12:00:00Z"],
      ["b", "2026-10-01T11:00:00Z"],
    ]);
    expect(history.every((h) => h.synced)).toBe(true);
  });
});
