import { describe, expect, it } from "vitest";
import { makeArtistProfile, makeTrack } from "@/test/factories";
import { isEmptyRecommendation, selectRecommendations } from "./select-recommendations";

const tracks = (...ids: string[]) => ids.map((id) => makeTrack({ id }));

describe("selectRecommendations", () => {
  it("retire les morceaux exclus et ceux déjà proposés sous un autre genre", () => {
    const result = selectRecommendations(
      {
        genres: [
          { genre: "House", tracks: tracks("known", "a", "b") },
          { genre: "Jazz", tracks: tracks("b", "c") },
        ],
        relatedArtists: [],
      },
      new Set(["known"]),
      undefined,
    );

    expect(result.genres.map((g) => [g.genre, g.tracks.map((t) => t.id)])).toEqual([
      ["House", ["a", "b"]],
      ["Jazz", ["c"]],
    ]);
  });

  it("limite chaque genre à six morceaux et masque les genres vidés", () => {
    const result = selectRecommendations(
      {
        genres: [
          { genre: "House", tracks: tracks("1", "2", "3", "4", "5", "6", "7", "8") },
          { genre: "Jazz", tracks: tracks("known") },
        ],
        relatedArtists: [],
      },
      new Set(["known"]),
      undefined,
    );

    expect(result.genres).toHaveLength(1);
    expect(result.genres[0]?.tracks).toHaveLength(6);
  });

  it("écarte l'artiste de référence des artistes proches", () => {
    const result = selectRecommendations(
      {
        genres: [],
        relatedArtists: [makeArtistProfile({ id: "ref" }), makeArtistProfile({ id: "other" })],
      },
      new Set(),
      "ref",
    );

    expect(result.relatedArtists.map((a) => a.id)).toEqual(["other"]);
  });
});

describe("isEmptyRecommendation", () => {
  it("est vrai sans morceau ni artiste", () => {
    expect(isEmptyRecommendation({ genres: [], relatedArtists: [] })).toBe(true);
    expect(isEmptyRecommendation({ genres: [], relatedArtists: [makeArtistProfile()] })).toBe(
      false,
    );
  });
});
