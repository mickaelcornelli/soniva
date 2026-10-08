const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Les dates de sortie sont des jours calendaires : en UTC, pas de décalage d'un jour selon le fuseau.
  timeZone: "UTC",
});

/** « 12 septembre 2026 », ou null si la date est absente ou invalide. */
export function formatLongDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : longDateFormatter.format(date);
}
