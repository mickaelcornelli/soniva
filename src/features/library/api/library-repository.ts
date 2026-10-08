import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/services/supabase/database.types";
import { getSupabaseBrowserClient } from "@/services/supabase/browser-client";
import { HISTORY_SIZE, type RemoteFavorite, type RemotePlay } from "../lib/library-sync-plan";

/** Accès aux tables de la bibliothèque. Les règles RLS limitent tout au compte connecté. */
export interface LibraryRepository {
  listFavorites(): Promise<RemoteFavorite[]>;
  addFavorites(favorites: readonly RemoteFavorite[]): Promise<void>;
  removeFavorite(trackId: string): Promise<void>;
  listPlays(): Promise<RemotePlay[]>;
  addPlays(plays: readonly RemotePlay[]): Promise<void>;
}

/** Les erreurs Supabase ne sont pas des `Error` : on les convertit pour garder une pile lisible. */
function fail(context: string, error: { message: string }): never {
  throw new Error(`[bibliothèque] ${context} : ${error.message}`);
}

export function createLibraryRepository(
  userId: string,
  client: SupabaseClient<Database> = getSupabaseBrowserClient(),
): LibraryRepository {
  return {
    async listFavorites() {
      const { data, error } = await client
        .from("favorites")
        .select("track_id, created_at")
        .order("created_at", { ascending: false });
      if (error) fail("lecture des favoris", error);
      return data.map((row) => ({ trackId: row.track_id, addedAt: row.created_at }));
    },

    async addFavorites(favorites) {
      if (favorites.length === 0) return;
      const { error } = await client.from("favorites").upsert(
        favorites.map(({ trackId, addedAt }) => ({
          user_id: userId,
          track_id: trackId,
          created_at: addedAt,
        })),
        // Déjà en favori sur un autre appareil : on garde la date d'origine.
        { onConflict: "user_id,track_id", ignoreDuplicates: true },
      );
      if (error) fail("ajout de favoris", error);
    },

    async removeFavorite(trackId) {
      const { error } = await client.from("favorites").delete().eq("track_id", trackId);
      if (error) fail("retrait d'un favori", error);
    },

    async listPlays() {
      // Le journal peut contenir plusieurs écoutes d'un même morceau : on en lit davantage
      // que la taille de l'historique affiché pour qu'il reste plein après dédoublonnage.
      const { data, error } = await client
        .from("listening_history")
        .select("track_id, played_at")
        .order("played_at", { ascending: false })
        .limit(HISTORY_SIZE * 3);
      if (error) fail("lecture de l'historique", error);
      return data.map((row) => ({ trackId: row.track_id, playedAt: row.played_at }));
    },

    async addPlays(plays) {
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
  };
}
