import { type RepeatMode, shuffle } from "@/features/player/lib/queue";
import type { Track } from "@/types/music";

/** Nombre de morceaux restants à partir duquel la radio prolonge la file. */
const REFILL_THRESHOLD = 1;

interface QueuePosition {
  radio: boolean;
  repeat: RepeatMode;
  queueLength: number;
  currentIndex: number;
}

/**
 * La radio ne prend le relais qu'en fin de file, et jamais quand une répétition est
 * active : dans ce cas, l'utilisateur a choisi de rester sur ce qu'il écoute.
 */
export function shouldExtendQueue({
  radio,
  repeat,
  queueLength,
  currentIndex,
}: QueuePosition): boolean {
  if (!radio || repeat !== "off" || currentIndex < 0) return false;
  return queueLength - currentIndex - 1 <= REFILL_THRESHOLD;
}

/** Sélection mélangée de morceaux inédits (ni dans la file, ni écoutés récemment). */
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
