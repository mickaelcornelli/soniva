import type { Artist, Playlist, Track } from "@/types/music";

/** Fabriques d'objets du domaine pour les tests de composants et d'utilitaires. */

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
