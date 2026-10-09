import type { Track } from "@/types/music";

export type RepeatMode = "off" | "all" | "one";

/** The same track can be queued several times, so each entry has its own ID. */
export interface QueueItem {
  queueId: string;
  track: Track;
}

let queueCounter = 0;

export function createQueueItems(tracks: readonly Track[]): QueueItem[] {
  return tracks.map((track) => ({ queueId: `${track.id}-${++queueCounter}`, track }));
}

export function getNextIndex(length: number, current: number, repeat: RepeatMode): number | null {
  if (length === 0) return null;
  if (current + 1 < length) return current + 1;
  return repeat === "all" ? 0 : null;
}

export function getPreviousIndex(
  length: number,
  current: number,
  repeat: RepeatMode,
): number | null {
  if (length === 0) return null;
  if (current > 0) return current - 1;
  return repeat === "all" ? length - 1 : null;
}

/** Fisher-Yates; `random` is injectable for deterministic tests. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

/** Only shuffles what's left to play: the current track and history stay put. */
export function shuffleUpcoming(
  queue: readonly QueueItem[],
  current: number,
  random?: () => number,
): QueueItem[] {
  return [...queue.slice(0, current + 1), ...shuffle(queue.slice(current + 1), random)];
}

/** Entries added while shuffled are kept at the end; entries removed meanwhile disappear. */
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
