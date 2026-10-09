export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

/**
 * Read lazily so the build and CI pass without these variables. Validated by hand
 * rather than with Zod: this module ships on every page and Zod added tens of KB.
 * `process.env.NEXT_PUBLIC_*` must stay spelled out for Next to inline them.
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
