/**
 * Internal paths only: prevents an open redirect through a
 * forged `next` parameter ("//evil.com", "https://...").
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
