import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/services/supabase/database.types";
import { getSupabaseBrowserClient } from "@/services/supabase/browser-client";
import { monthStartDate } from "../lib/month";
import type { ListeningRow } from "../lib/summarize-month";
import type { PendingListening } from "../store/listening-store";

/** Accès aux statistiques d'écoute du compte connecté (règles RLS côté base). */
export interface ListeningRepository {
  /** Ajoute des écoutes : la base incrémente les compteurs existants. */
  record(entries: readonly PendingListening[]): Promise<void>;
  listMonth(month: string): Promise<ListeningRow[]>;
}

function fail(context: string, error: { message: string }): never {
  throw new Error(`[statistiques] ${context} : ${error.message}`);
}

export function createListeningRepository(
  client: SupabaseClient<Database> = getSupabaseBrowserClient(),
): ListeningRepository {
  return {
    async record(entries) {
      if (entries.length === 0) return;
      const { error } = await client.rpc("record_listening", {
        entries: entries.map((entry) => ({
          month: monthStartDate(entry.month),
          track_id: entry.trackId,
          artist_id: entry.artistId,
          genre: entry.genre,
          plays: entry.plays,
          seconds: Math.round(entry.seconds),
        })),
      });
      if (error) fail("enregistrement des écoutes", error);
    },

    async listMonth(month) {
      const { data, error } = await client
        .from("listening_stats")
        .select("track_id, artist_id, genre, plays, seconds")
        .eq("month", monthStartDate(month));
      if (error) fail("lecture des statistiques", error);
      return data.map((row) => ({
        trackId: row.track_id,
        artistId: row.artist_id,
        genre: row.genre,
        plays: row.plays,
        seconds: row.seconds,
      }));
    },
  };
}
