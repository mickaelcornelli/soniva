import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/config/public-env";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | undefined;

/** Client Supabase du navigateur (session stockée en cookies), créé une seule fois. */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!client) {
    const { url, publishableKey } = getSupabaseConfig();
    client = createBrowserClient<Database>(url, publishableKey);
  }
  return client;
}
