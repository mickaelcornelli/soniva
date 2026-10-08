import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/services/supabase/browser-client";
import type { Database } from "@/services/supabase/database.types";
import type { UserPlaylist } from "../types";

/** Code Postgres d'une violation d'unicité : le morceau est déjà dans la playlist. */
const UNIQUE_VIOLATION = "23505";

export type AddTrackResult = "added" | "duplicate";

export interface PlaylistDetailRow extends UserPlaylist {
  /** Identifiants des morceaux, dans l'ordre de la playlist. */
  trackIds: string[];
}

export interface PlaylistsRepository {
  list(): Promise<UserPlaylist[]>;
  get(id: string): Promise<PlaylistDetailRow | null>;
  create(name: string): Promise<UserPlaylist>;
  update(id: string, changes: { name?: string; description?: string | null }): Promise<void>;
  remove(id: string): Promise<void>;
  addTrack(playlistId: string, trackId: string): Promise<AddTrackResult>;
  removeTrack(playlistId: string, trackId: string): Promise<void>;
}

function fail(context: string, error: { message: string }): never {
  throw new Error(`[playlists] ${context} : ${error.message}`);
}

export function createPlaylistsRepository(
  userId: string,
  client: SupabaseClient<Database> = getSupabaseBrowserClient(),
): PlaylistsRepository {
  return {
    async list() {
      const { data, error } = await client
        .from("playlists")
        .select("id, name, description, updated_at, playlist_tracks(count)")
        .order("updated_at", { ascending: false });
      if (error) fail("lecture des playlists", error);
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        updatedAt: row.updated_at,
        trackCount: row.playlist_tracks[0]?.count ?? 0,
      }));
    },

    async get(id) {
      const { data, error } = await client
        .from("playlists")
        .select("id, name, description, updated_at, playlist_tracks(track_id, position)")
        .eq("id", id)
        .order("position", { referencedTable: "playlist_tracks" })
        .maybeSingle();
      if (error) fail("lecture d'une playlist", error);
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        updatedAt: data.updated_at,
        trackCount: data.playlist_tracks.length,
        trackIds: data.playlist_tracks.map((row) => row.track_id),
      };
    },

    async create(name) {
      const { data, error } = await client
        .from("playlists")
        .insert({ user_id: userId, name })
        .select("id, name, description, updated_at")
        .single();
      if (error) fail("création d'une playlist", error);
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        updatedAt: data.updated_at,
        trackCount: 0,
      };
    },

    async update(id, changes) {
      const { error } = await client.from("playlists").update(changes).eq("id", id);
      if (error) fail("modification d'une playlist", error);
    },

    async remove(id) {
      const { error } = await client.from("playlists").delete().eq("id", id);
      if (error) fail("suppression d'une playlist", error);
    },

    async addTrack(playlistId, trackId) {
      // Nouveau morceau en fin de playlist : position = dernière position + 1.
      const { data: last, error: readError } = await client
        .from("playlist_tracks")
        .select("position")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (readError) fail("lecture de la playlist", readError);

      const { error } = await client.from("playlist_tracks").insert({
        playlist_id: playlistId,
        track_id: trackId,
        position: (last?.position ?? -1) + 1,
      });
      if (error?.code === UNIQUE_VIOLATION) return "duplicate";
      if (error) fail("ajout d'un morceau", error);

      // L'ordre de la bibliothèque suit la dernière modification de chaque playlist.
      await client
        .from("playlists")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", playlistId);
      return "added";
    },

    async removeTrack(playlistId, trackId) {
      const { error } = await client
        .from("playlist_tracks")
        .delete()
        .eq("playlist_id", playlistId)
        .eq("track_id", trackId);
      if (error) fail("retrait d'un morceau", error);
    },
  };
}
