const compactFormatter = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Nombre court et lisible : 12 400 → « 12,4 k ». */
export function formatCompactNumber(value: number): string {
  return compactFormatter.format(Number.isFinite(value) ? value : 0);
}
