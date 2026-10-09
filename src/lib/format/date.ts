const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Release dates are calendar days: UTC avoids an off-by-one-day shift across time zones.
  timeZone: "UTC",
});

export function formatLongDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : longDateFormatter.format(date);
}
