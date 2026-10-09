import { describe, expect, it } from "vitest";
import { makeArtist, makeTrack } from "@/test/factories";
import { buildTasteProfile, pickFreshTracks } from "./taste-profile";

const house = (id: string, artistId = "a1") =>
  makeTrack({ id, genre: "House", artist: makeArtist({ id: artistId }) });
const jazz = (id: string, artistId = "a2") =>
  makeTrack({ id, genre: "Jazz", artist: makeArtist({ id: artistId }) });

describe("buildTasteProfile", () => {
  it("pondère les favoris plus fortement que les écoutes", () => {
    // 1 House favourite (3 points) vs 2 Jazz plays (2 points).
    const profile = buildTasteProfile([house("f1")], [jazz("h1"), jazz("h2")]);

    expect(profile.genres).toEqual(["House", "Jazz"]);
    expect(profile.topArtist?.id).toBe("a1");
  });

  it("ne garde que les deux genres dominants et ignore les morceaux sans genre", () => {
    const profile = buildTasteProfile(
      [],
      [
        house("1"),
        house("2"),
        jazz("3"),
        makeTrack({ id: "4", genre: "Rock" }),
        makeTrack({ id: "5", genre: null }),
      ],
    );

    expect(profile.genres).toEqual(["House", "Jazz"]);
  });

  it("liste les morceaux déjà connus", () => {
    const profile = buildTasteProfile([house("f1")], [jazz("h1")]);

    expect([...profile.knownTrackIds].sort()).toEqual(["f1", "h1"]);
  });

  it("renvoie un profil vide sans écoute ni favori", () => {
    expect(buildTasteProfile([], [])).toMatchObject({ genres: [], topArtist: null });
  });
});

describe("pickFreshTracks", () => {
  it("écarte les morceaux exclus et limite le nombre", () => {
    const tracks = ["a", "b", "c", "d"].map((id) => makeTrack({ id }));

    expect(pickFreshTracks(tracks, new Set(["b"]), 2).map((t) => t.id)).toEqual(["a", "c"]);
  });
});
