import { z } from "zod";

const supabaseConfigSchema = z.object({
  url: z.url(),
  publishableKey: z.string().min(1),
});

/**
 * Configuration publique de Supabase. Lue à la demande plutôt qu'au chargement du module :
 * le build (et la CI) passe sans ces variables, l'erreur n'apparaît qu'à la première utilisation.
 * Les `process.env.NEXT_PUBLIC_*` doivent rester écrits en entier pour que Next les injecte.
 */
export function getSupabaseConfig() {
  return supabaseConfigSchema.parse(readSupabaseEnv());
}

/** Permet à l'interface de masquer les fonctions de compte si Supabase n'est pas configuré. */
export function isSupabaseConfigured(): boolean {
  return supabaseConfigSchema.safeParse(readSupabaseEnv()).success;
}

function readSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}
