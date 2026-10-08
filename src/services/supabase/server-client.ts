import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/config/public-env";
import type { Database } from "./database.types";

/** Client Supabase côté serveur (route handlers), qui lit et écrit les cookies de session. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseConfig();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appel depuis un Server Component (cookies en lecture seule) : sans effet ici,
          // le client du navigateur rafraîchit lui-même la session.
        }
      },
    },
  });
}
