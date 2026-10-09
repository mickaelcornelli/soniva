export function makeAudiusUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "nlGNe",
    name: "Lune Rouge",
    handle: "lunerouge",
    is_verified: true,
    profile_picture: null,
    ...overrides,
  };
}

export function makeAudiusTrack(overrides: Record<string, unknown> = {}) {
  return {
    id: "D7KyD",
    title: "Night Drive",
    duration: 214,
    genre: "Electronic",
    mood: "",
    description: "  Enregistré de nuit.  ",
    tags: "synthwave, night,,synthwave",
    release_date: "2026-09-12T00:00:00Z",
    play_count: 12_400,
    favorite_count: 830,
    is_streamable: true,
    is_stream_gated: false,
    artwork: {
      "150x150": "https://cdn.example/150.jpg",
      "480x480": "https://cdn.example/480.jpg",
      "1000x1000": "https://cdn.example/1000.jpg",
    },
    user: makeAudiusUser(),
    // Unused field: must be ignored without error.
    route_id: "lunerouge/night-drive",
    ...overrides,
  };
}

export function makeAudiusUserProfile(overrides: Record<string, unknown> = {}) {
  return makeAudiusUser({
    bio: "Synthés analogiques et longues routes.",
    location: "Lyon",
    cover_photo: { "640x": "https://cdn.example/640.jpg", "2000x": "https://cdn.example/2000.jpg" },
    follower_count: 5_200,
    track_count: 34,
    playlist_count: 3,
    ...overrides,
  });
}

export function makeAudiusPlaylist(overrides: Record<string, unknown> = {}) {
  return {
    id: "pl9X2",
    playlist_name: "Routes de nuit",
    description: null,
    is_album: false,
    is_private: false,
    artwork: null,
    user: makeAudiusUser(),
    track_count: 12,
    favorite_count: 40,
    total_play_count: 9_000,
    ...overrides,
  };
}
