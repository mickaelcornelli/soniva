/**
 * A larger gap between two positions is a seek, not listening. The
 * audio element reports its position about four times a second.
 */
const MAX_TICK_SECONDS = 2;

export function listenedBetween(previous: number, next: number): number {
  const delta = next - previous;
  return delta > 0 && delta <= MAX_TICK_SECONDS ? delta : 0;
}
