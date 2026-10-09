import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/services/supabase/database.types";
import { getSupabaseBrowserClient } from "@/services/supabase/browser-client";
import {
  HISTORY_SIZE,
  type RemoteFavorite,
  type RemoteFollow,
  type RemotePlay,
} from "../lib/library-sync-plan";

/** RLS policies restrict everything to the signed-in account. */
export interface LibraryRepository {
  listFavorites(): Promise<RemoteFavorite[]>;
  addFavorites(favorites: readonly RemoteFavorite[]): Promise<void>;
  removeFavorite(trackId: string): Promise<void>;
  listPlays(): Promise<RemotePlay[]>;
  addPlays(plays: readonly RemotePlay[]): Promise<void>;
  listFollows(): Promise<RemoteFollow[]>;
  addFollows(follows: readonly RemoteFollow[]): Promise<void>;
  removeFollow(artistId: string): Promise<void>;
}

/** Supabase errors aren't `Error` instances: wrap them to keep a readable stack. */
function fail(context: string, error: { message: string }): never {
  throw new Error(`[bibliothèque] ${context} : ${error.message}`);
}

export function createLibraryRepository(
  userId: string,
  getClient: () => Promise<SupabaseClient<Database>> = getSupabaseBrowserClient,
): LibraryRepository {
  return {
    async listFavorites() {
      const client = await getClient();
      const { data, error } = await client
        .from("favorites")
        .select("track_id, created_at")
        .order("created_at", { ascending: false });
      if (error) fail("lecture des favoris", error);
      return data.map((row) => ({ trackId: row.track_id, addedAt: row.created_at }));
    },

    async addFavorites(favorites) {
      const client = await getClient();
      if (favorites.length === 0) return;
      const { error } = await client.from("favorites").upsert(
        favorites.map(({ trackId, addedAt }) => ({
          user_id: userId,
          track_id: trackId,
          created_at: addedAt,
        })),
        // Already a favourite on another device: keep the original date.
        { onConflict: "user_id,track_id", ignoreDuplicates: true },
      );
      if (error) fail("ajout de favoris", error);
    },

    async removeFavorite(trackId) {
      const client = await getClient();
      const { error } = await client.from("favorites").delete().eq("track_id", trackId);
      if (error) fail("retrait d'un favori", error);
    },

    async listPlays() {
      const client = await getClient();
      // The log can hold several plays of the same track: read more than
      // the displayed history so it stays full after deduplication.
      const { data, error } = await client
        .from("listening_history")
        .select("track_id, played_at")
        .order("played_at", { ascending: false })
        .limit(HISTORY_SIZE * 3);
      if (error) fail("lecture de l'historique", error);
      return data.map((row) => ({ trackId: row.track_id, playedAt: row.played_at }));
    },

    async addPlays(plays) {
      const client = await getClient();
      if (plays.length === 0) return;
      const { error } = await client.from("listening_history").insert(
        plays.map(({ trackId, playedAt }) => ({
          user_id: userId,
          track_id: trackId,
          played_at: playedAt,
        })),
      );
      if (error) fail("enregistrement d'écoutes", error);
    },

    async listFollows() {
      const client = await getClient();
      const { data, error } = await client
        .from("followed_artists")
        .select("artist_id, created_at")
        .order("created_at", { ascending: false });
      if (error) fail("lecture des artistes suivis", error);
      return data.map((row) => ({ artistId: row.artist_id, followedAt: row.created_at }));
    },

    async addFollows(follows) {
      const client = await getClient();
      if (follows.length === 0) return;
      const { error } = await client.from("followed_artists").upsert(
        follows.map(({ artistId, followedAt }) => ({
          user_id: userId,
          artist_id: artistId,
          created_at: followedAt,
        })),
        { onConflict: "user_id,artist_id", ignoreDuplicates: true },
      );
      if (error) fail("suivi d'artistes", error);
    },

    async removeFollow(artistId) {
      const client = await getClient();
      const { error } = await client.from("followed_artists").delete().eq("artist_id", artistId);
      if (error) fail("arrêt du suivi d'un artiste", error);
    },
  };
}
