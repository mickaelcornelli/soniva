import type { Track } from "@/types/music";

export type RepeatMode = "off" | "all" | "one";

/**
 * Un même morceau peut apparaître plusieurs fois dans la file : chaque entrée
 * a donc son propre identifiant, distinct de celui du morceau.
 */
export interface QueueItem {
  queueId: string;
  track: Track;
}

let queueCounter = 0;

export function createQueueItems(tracks: readonly Track[]): QueueItem[] {
  return tracks.map((track) => ({ queueId: `${track.id}-${++queueCounter}`, track }));
}

/** Index du morceau suivant, ou null quand la file est terminée. */
export function getNextIndex(length: number, current: number, repeat: RepeatMode): number | null {
  if (length === 0) return null;
  if (current + 1 < length) return current + 1;
  return repeat === "all" ? 0 : null;
}

/** Index du morceau précédent, ou null au début de la file. */
export function getPreviousIndex(
  length: number,
  current: number,
  repeat: RepeatMode,
): number | null {
  if (length === 0) return null;
  if (current > 0) return current - 1;
  return repeat === "all" ? length - 1 : null;
}

/** Mélange de Fisher-Yates ; `random` est injectable pour des tests déterministes. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

/** Mélange uniquement ce qui reste à écouter : le morceau en cours et l'historique ne bougent pas. */
export function shuffleUpcoming(
  queue: readonly QueueItem[],
  current: number,
  random?: () => number,
): QueueItem[] {
  return [...queue.slice(0, current + 1), ...shuffle(queue.slice(current + 1), random)];
}

/**
 * Restaure l'ordre d'origine après un mélange. Les entrées ajoutées pendant le mélange
 * sont conservées à la fin ; celles retirées entre-temps disparaissent.
 */
export function restoreOrder(
  shuffled: readonly QueueItem[],
  original: readonly QueueItem[],
): QueueItem[] {
  const present = new Set(shuffled.map((item) => item.queueId));
  const known = new Set(original.map((item) => item.queueId));
  return [
    ...original.filter((item) => present.has(item.queueId)),
    ...shuffled.filter((item) => !known.has(item.queueId)),
  ];
}
