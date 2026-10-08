import type { Track } from "@/types/music";

/** Playlist personnelle (stockée dans Supabase, contrairement aux playlists Audius). */
export interface UserPlaylist {
  id: string;
  name: string;
  description: string | null;
  trackCount: number;
  updatedAt: string;
}

export interface UserPlaylistWithTracks extends UserPlaylist {
  tracks: Track[];
}
