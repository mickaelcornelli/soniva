/** Providers enabled in Supabase (Authentication > Providers). */
export const AUTH_PROVIDERS = [
  { id: "github", label: "GitHub" },
  { id: "google", label: "Google" },
] as const;

export type AuthProviderId = (typeof AUTH_PROVIDERS)[number]["id"];
