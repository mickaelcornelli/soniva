/**
 * Secondary page data: on failure, log and render
 * the page without that section instead of erroring.
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
