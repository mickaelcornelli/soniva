/** Réponse Audius minimale mais réaliste, partagée par les tests. */
export function makeAudiusTrack(overrides: Record<string, unknown> = {}) {
  return {
    id: "D7KyD",
    title: "Night Drive",
    duration: 214,
    genre: "Electronic",
    mood: "",
    play_count: 12_400,
    favorite_count: 830,
    is_streamable: true,
    is_stream_gated: false,
    artwork: {
      "150x150": "https://cdn.example/150.jpg",
      "480x480": "https://cdn.example/480.jpg",
      "1000x1000": "https://cdn.example/1000.jpg",
    },
    user: {
      id: "nlGNe",
      name: "Lune Rouge",
      handle: "lunerouge",
      is_verified: true,
      profile_picture: null,
    },
    // Champ non utilisé : doit être ignoré sans erreur.
    route_id: "lunerouge/night-drive",
    ...overrides,
  };
}
