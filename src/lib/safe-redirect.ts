/**
 * N'accepte que des chemins internes (« /bibliotheque »). Empêche une redirection ouverte
 * vers un autre site via un paramètre `next` forgé (« //evil.com », « https://… »).
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
