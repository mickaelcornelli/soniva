import type { Track } from "@/types/music";

/** Stored in Supabase, unlike Audius playlists. */
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
