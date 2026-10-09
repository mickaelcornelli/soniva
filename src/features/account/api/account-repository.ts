import type { SupabaseClient } from "@supabase/supabase-js";
import { toAppUser } from "@/features/auth/lib/app-user";
import { getSupabaseBrowserClient } from "@/services/supabase/browser-client";
import type { Database } from "@/services/supabase/database.types";
import type { AccountData } from "../types";

/** Taille de page maximale renvoyée par l'API Supabase (PostgREST) en une requête. */
const PAGE_SIZE = 1000;

export interface AccountRepository {
  /** Toutes les données du compte connecté (RGPD : droit d'accès et portabilité). */
  exportData(): Promise<AccountData>;
  /** Supprime le compte et, par cascade, toutes ses données (RGPD : droit à l'effacement). */
  deleteAccount(): Promise<void>;
}

function fail(context: string, error: { message: string }): never {
  throw new Error(`[compte] ${context} : ${error.message}`);
}

function rowsOf<T>(
  result: { data: T[] | null; error: { message: string } | null },
  context: string,
): T[] {
  if (result.error) fail(context, result.error);
  return result.data ?? [];
}

export function createAccountRepository(
  getClient: () => Promise<SupabaseClient<Database>> = getSupabaseBrowserClient,
): AccountRepository {
  /** Les statistiques peuvent dépasser une page : lues par tranches jusqu'à la dernière. */
  async function listAllStats() {
    const client = await getClient();
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const page = rowsOf(
        await client
          .from("listening_stats")
          .select("month, track_id, artist_id, genre, plays, seconds")
          .order("month", { ascending: false })
          .order("track_id")
          .range(from, from + PAGE_SIZE - 1),
        "lecture des statistiques",
      );
      rows.push(...page);
      if (page.length < PAGE_SIZE) return rows;
    }
  }

  return {
    async exportData() {
      const client = await getClient();
      const { data, error } = await client.auth.getUser();
      if (error) fail("lecture du compte", error);
      const { user } = data;
      const appUser = toAppUser(user);

      const [favorites, follows, playlists, history, stats] = await Promise.all([
        client
          .from("favorites")
          .select("track_id, created_at")
          .order("created_at", { ascending: false }),
        client
          .from("followed_artists")
          .select("artist_id, created_at")
          .order("created_at", { ascending: false }),
        client
          .from("playlists")
          .select(
            "id, name, description, created_at, updated_at, playlist_tracks(track_id, position, added_at)",
          )
          .order("created_at")
          .order("position", { referencedTable: "playlist_tracks" }),
        client
          .from("listening_history")
          .select("track_id, played_at")
          .order("played_at", { ascending: false }),
        listAllStats(),
      ]);

      return {
        profile: {
          id: user.id,
          email: user.email ?? null,
          name: appUser.name,
          avatarUrl: appUser.avatarUrl,
          providers: (user.identities ?? []).map((identity) => identity.provider),
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at ?? null,
        },
        favorites: rowsOf(favorites, "lecture des favoris").map((row) => ({
          trackId: row.track_id,
          addedAt: row.created_at,
        })),
        followedArtists: rowsOf(follows, "lecture des artistes suivis").map((row) => ({
          artistId: row.artist_id,
          followedAt: row.created_at,
        })),
        playlists: rowsOf(playlists, "lecture des playlists").map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          tracks: row.playlist_tracks.map((track) => ({
            trackId: track.track_id,
            position: track.position,
            addedAt: track.added_at,
          })),
        })),
        listeningHistory: rowsOf(history, "lecture de l'historique").map((row) => ({
          trackId: row.track_id,
          playedAt: row.played_at,
        })),
        listeningStats: stats.map((row) => ({
          month: row.month,
          trackId: row.track_id,
          artistId: row.artist_id,
          genre: row.genre,
          plays: row.plays,
          seconds: row.seconds,
        })),
      };
    },

    async deleteAccount() {
      const client = await getClient();
      const { error } = await client.rpc("delete_my_account");
      if (error) fail("suppression du compte", error);
    },
  };
}
