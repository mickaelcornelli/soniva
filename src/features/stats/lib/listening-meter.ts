/**
 * Au-delà de cet écart entre deux positions de lecture successives, ce n'est pas de
 * l'écoute mais un saut (avance rapide, retour en arrière) : il n'est pas compté.
 * L'élément audio signale sa position environ quatre fois par seconde.
 */
const MAX_TICK_SECONDS = 2;

/** Temps réellement écouté entre deux positions de lecture successives. */
export function listenedBetween(previous: number, next: number): number {
  const delta = next - previous;
  return delta > 0 && delta <= MAX_TICK_SECONDS ? delta : 0;
}
