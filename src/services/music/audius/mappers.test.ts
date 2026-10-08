import { describe, expect, it } from "vitest";
import { makeAudiusTrack } from "./fixtures";
import { parseTracks } from "./mappers";

describe("parseTracks", () => {
  it("convertit un morceau Audius vers le type du domaine", () => {
    const [track] = parseTracks([makeAudiusTrack()]);

    expect(track).toEqual({
      id: "D7KyD",
      title: "Night Drive",
      durationSeconds: 214,
      genre: "Electronic",
      mood: null,
      playCount: 12_400,
      favoriteCount: 830,
      artwork: {
        small: "https://cdn.example/150.jpg",
        medium: "https://cdn.example/480.jpg",
        large: "https://cdn.example/1000.jpg",
      },
      artist: {
        id: "nlGNe",
        name: "Lune Rouge",
        handle: "lunerouge",
        isVerified: true,
        avatar: { small: undefined, medium: undefined, large: undefined },
      },
    });
  });

  it("écarte les éléments mal formés sans faire échouer la liste", () => {
    const tracks = parseTracks([makeAudiusTrack(), { id: 42 }, null, makeAudiusTrack({ id: "x" })]);

    expect(tracks.map((t) => t.id)).toEqual(["D7KyD", "x"]);
  });

  it("écarte les morceaux non lisibles gratuitement", () => {
    const tracks = parseTracks([
      makeAudiusTrack({ id: "gated", is_stream_gated: true }),
      makeAudiusTrack({ id: "off", is_streamable: false }),
      makeAudiusTrack({ id: "ok" }),
    ]);

    expect(tracks.map((t) => t.id)).toEqual(["ok"]);
  });

  it("applique des valeurs par défaut quand les compteurs manquent", () => {
    const [track] = parseTracks([
      makeAudiusTrack({ play_count: undefined, favorite_count: undefined, artwork: null }),
    ]);

    expect(track?.playCount).toBe(0);
    expect(track?.favoriteCount).toBe(0);
    expect(track?.artwork).toEqual({ small: undefined, medium: undefined, large: undefined });
  });
});
