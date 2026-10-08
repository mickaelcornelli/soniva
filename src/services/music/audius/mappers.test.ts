import { describe, expect, it } from "vitest";
import { makeAudiusPlaylist, makeAudiusTrack, makeAudiusUserProfile } from "./fixtures";
import {
  parseArtistProfile,
  parsePlaylist,
  parsePlaylists,
  parseTags,
  parseTrack,
  parseTracks,
} from "./mappers";

const emptyArtwork = { small: undefined, medium: undefined, large: undefined };

describe("parseTracks", () => {
  it("convertit un morceau Audius vers le type du domaine", () => {
    const [track] = parseTracks([makeAudiusTrack()]);

    expect(track).toEqual({
      id: "D7KyD",
      title: "Night Drive",
      durationSeconds: 214,
      genre: "Electronic",
      mood: null,
      description: "Enregistré de nuit.",
      tags: ["synthwave", "night"],
      releaseDate: "2026-09-12T00:00:00Z",
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
        avatar: emptyArtwork,
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

  it("applique des valeurs par défaut quand les champs optionnels manquent", () => {
    const track = parseTrack(
      makeAudiusTrack({
        play_count: undefined,
        favorite_count: undefined,
        artwork: null,
        description: null,
        tags: null,
        release_date: null,
      }),
    );

    expect(track).toMatchObject({
      playCount: 0,
      favoriteCount: 0,
      artwork: emptyArtwork,
      description: null,
      tags: [],
      releaseDate: null,
    });
  });
});

describe("parseTags", () => {
  it("découpe, nettoie et dédoublonne", () => {
    expect(parseTags(" lofi, chill ,,lofi")).toEqual(["lofi", "chill"]);
    expect(parseTags(null)).toEqual([]);
  });
});

describe("parseArtistProfile", () => {
  it("convertit le profil complet, bannière comprise", () => {
    expect(parseArtistProfile(makeAudiusUserProfile())).toMatchObject({
      handle: "lunerouge",
      bio: "Synthés analogiques et longues routes.",
      location: "Lyon",
      cover: { medium: "https://cdn.example/640.jpg", large: "https://cdn.example/2000.jpg" },
      followerCount: 5_200,
      trackCount: 34,
      playlistCount: 3,
    });
  });

  it("renvoie null pour une réponse invalide", () => {
    expect(parseArtistProfile(undefined)).toBeNull();
  });
});

describe("parsePlaylist", () => {
  it("convertit une playlist et son propriétaire", () => {
    expect(parsePlaylist(makeAudiusPlaylist())).toMatchObject({
      id: "pl9X2",
      name: "Routes de nuit",
      isAlbum: false,
      owner: { handle: "lunerouge" },
      trackCount: 12,
      playCount: 9_000,
    });
  });

  it("écarte les playlists privées", () => {
    const playlists = parsePlaylists([
      makeAudiusPlaylist({ id: "private", is_private: true }),
      makeAudiusPlaylist({ id: "public" }),
    ]);

    expect(playlists.map((p) => p.id)).toEqual(["public"]);
  });
});
