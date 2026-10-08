const integerFormatter = new Intl.NumberFormat("fr-FR");

/** « 1 morceau », « 12 morceaux », « 1 200 abonnés ». En français, 0 et 1 sont au singulier. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${integerFormatter.format(count)} ${Math.abs(count) < 2 ? singular : plural}`;
}
