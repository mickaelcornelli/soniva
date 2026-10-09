import { type RepeatMode, shuffle } from "@/features/player/lib/queue";
import type { Track } from "@/types/music";

const REFILL_THRESHOLD = 1;

interface QueuePosition {
  radio: boolean;
  repeat: RepeatMode;
  queueLength: number;
  currentIndex: number;
}

/** Never while a repeat mode is on: the user chose to stay on what they're listening to. */
export function shouldExtendQueue({
  radio,
  repeat,
  queueLength,
  currentIndex,
}: QueuePosition): boolean {
  if (!radio || repeat !== "off" || currentIndex < 0) return false;
  return queueLength - currentIndex - 1 <= REFILL_THRESHOLD;
}

export function pickRadioTracks(
  candidates: readonly Track[],
  excludedIds: ReadonlySet<string>,
  limit: number,
  random?: () => number,
): Track[] {
  const seen = new Set(excludedIds);
  const fresh = candidates.filter((track) => {
    if (seen.has(track.id)) return false;
    seen.add(track.id);
    return true;
  });
  return shuffle(fresh, random).slice(0, limit);
}
