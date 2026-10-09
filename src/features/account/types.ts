export interface AccountData {
  profile: {
    id: string;
    email: string | null;
    name: string;
    avatarUrl: string | null;
    providers: string[];
    createdAt: string;
    lastSignInAt: string | null;
  };
  favorites: { trackId: string; addedAt: string }[];
  followedArtists: { artistId: string; followedAt: string }[];
  playlists: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    tracks: { trackId: string; position: number; addedAt: string }[];
  }[];
  listeningHistory: { trackId: string; playedAt: string }[];
  listeningStats: {
    month: string;
    trackId: string;
    artistId: string;
    genre: string | null;
    plays: number;
    seconds: number;
  }[];
}
