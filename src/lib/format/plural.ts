const integerFormatter = new Intl.NumberFormat("fr-FR");

/** In French, 0 and 1 take the singular. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${integerFormatter.format(count)} ${Math.abs(count) < 2 ? singular : plural}`;
}
