import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/config/public-env";
import type { Database } from "./database.types";

let clientPromise: Promise<SupabaseClient<Database>> | undefined;

/**
 * Client Supabase du navigateur (session en cookies), créé une seule fois. Chargé à la
 * demande : la bibliothèque pèse près de 100 Ko et n'est utile qu'aux fonctions de compte,
 * pas à l'affichage des pages.
 */
export function getSupabaseBrowserClient(): Promise<SupabaseClient<Database>> {
  clientPromise ??= import("@supabase/ssr")
    .then(({ createBrowserClient }) => {
      const { url, publishableKey } = getSupabaseConfig();
      return createBrowserClient<Database>(url, publishableKey);
    })
    .catch((error: unknown) => {
      // Échec réseau du chargement : la prochaine demande retentera.
      clientPromise = undefined;
      throw error;
    });
  return clientPromise;
}

/**
 * Vrai si ce navigateur garde un cookie de session Supabase (`sb-…-auth-token`, parfois
 * découpé en `.0`, `.1`…). Sans lui, inutile de charger Supabase pour savoir qui est connecté.
 */
export function hasStoredSession(cookies: string = document.cookie): boolean {
  return cookies.split(";").some((cookie) => /^sb-[^=]+-auth-token(\.\d+)?=/.test(cookie.trim()));
}
