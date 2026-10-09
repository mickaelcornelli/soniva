import type { Artist, ArtistProfile, Playlist, Track } from "@/types/music";

export function makeArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: "a1",
    name: "Lune Rouge",
    handle: "lunerouge",
    isVerified: false,
    avatar: {},
    ...overrides,
  };
}

export function makeArtistProfile(overrides: Partial<ArtistProfile> = {}): ArtistProfile {
  return {
    ...makeArtist(),
    bio: null,
    location: null,
    cover: {},
    followerCount: 5_200,
    trackCount: 12,
    playlistCount: 2,
    ...overrides,
  };
}

export function makeTrack(overrides: Partial<Track> = {}): Track {
  return {
    id: "t1",
    title: "Night Drive",
    durationSeconds: 214,
    genre: "Electronic",
    mood: null,
    description: null,
    tags: [],
    releaseDate: null,
    playCount: 1_000,
    favoriteCount: 10,
    artwork: {},
    artist: makeArtist(),
    ...overrides,
  };
}

export function makePlaylist(overrides: Partial<Playlist> = {}): Playlist {
  return {
    id: "p1",
    name: "Routes de nuit",
    description: null,
    isAlbum: false,
    artwork: {},
    owner: makeArtist(),
    trackCount: 12,
    favoriteCount: 40,
    playCount: 9_000,
    ...overrides,
  };
}
