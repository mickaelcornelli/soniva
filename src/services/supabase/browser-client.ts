import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/config/public-env";
import type { Database } from "./database.types";

let clientPromise: Promise<SupabaseClient<Database>> | undefined;

/** Loaded on demand: the library weighs about 100 KB and only account features need it. */
export function getSupabaseBrowserClient(): Promise<SupabaseClient<Database>> {
  clientPromise ??= import("@supabase/ssr")
    .then(({ createBrowserClient }) => {
      const { url, publishableKey } = getSupabaseConfig();
      return createBrowserClient<Database>(url, publishableKey);
    })
    .catch((error: unknown) => {
      // Network failure while loading: the next call retries.
      clientPromise = undefined;
      throw error;
    });
  return clientPromise;
}

/**
 * Session cookie `sb-…-auth-token`, sometimes split into
 * `.0`, `.1`… Without it there's no need to load Supabase.
 */
export function hasStoredSession(cookies: string = document.cookie): boolean {
  return cookies.split(";").some((cookie) => /^sb-[^=]+-auth-token(\.\d+)?=/.test(cookie.trim()));
}
