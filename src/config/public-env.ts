export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

/**
 * Configuration publique de Supabase. Lue à la demande plutôt qu'au chargement du module :
 * le build (et la CI) passe sans ces variables, l'erreur n'apparaît qu'à la première utilisation.
 * Validation écrite à la main, sans Zod : ce module est chargé sur chaque page côté
 * navigateur, et Zod y ajoutait plusieurs dizaines de Ko pour deux champs.
 * Les `process.env.NEXT_PUBLIC_*` doivent rester écrits en entier pour que Next les injecte.
 */
export function readSupabaseConfig(
  url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
): SupabaseConfig | null {
  if (!url || !publishableKey || !isHttpUrl(url)) return null;
  return { url, publishableKey };
}

export function getSupabaseConfig(): SupabaseConfig {
  const config = readSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase n'est pas configuré : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY sont requises.",
    );
  }
  return config;
}

/** Permet à l'interface de masquer les fonctions de compte si Supabase n'est pas configuré. */
export function isSupabaseConfigured(): boolean {
  return readSupabaseConfig() !== null;
}

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
