/**
 * Charge une donnée secondaire d'une page : en cas d'échec, l'erreur est journalisée
 * et la page s'affiche sans cette section plutôt que de basculer en erreur.
 */
export async function loadOptional<T>(
  load: () => Promise<T>,
  fallback: T,
  context: string,
): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.error(`[${context}] donnée secondaire indisponible`, error);
    return fallback;
  }
}
