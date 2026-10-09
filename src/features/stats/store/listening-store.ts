import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Track } from "@/types/music";
import { DEVICE_STORAGE_KEYS } from "@/lib/device-storage";
import type { ListeningRow } from "../lib/summarize-month";
import { toMonthKey } from "../lib/month";

/** Enough to show this month and the previous one. */
const MONTHS_KEPT = 2;

export interface TrackListening {
  track: Track;
  plays: number;
  seconds: number;
}

/** Not yet sent to the account (or made signed out, sent on sign-in). */
export interface PendingListening extends ListeningRow {
  month: string;
}

interface ListeningState {
  months: Record<string, Record<string, TrackListening>>;
  pending: PendingListening[];
}

interface ListeningActions {
  record: (track: Track, listened: { plays: number; seconds: number }, at?: Date) => void;
  takePending: () => PendingListening[];
  restorePending: (entries: readonly PendingListening[]) => void;
  clear: () => void;
}

const emptyState: ListeningState = { months: {}, pending: [] };

/** Adds up plays of the same track in the same month instead of stacking rows. */
function mergePending(
  pending: readonly PendingListening[],
  additions: readonly PendingListening[],
): PendingListening[] {
  const merged = new Map(pending.map((entry) => [`${entry.month}|${entry.trackId}`, entry]));
  for (const entry of additions) {
    const key = `${entry.month}|${entry.trackId}`;
    const existing = merged.get(key);
    merged.set(
      key,
      existing
        ? {
            ...existing,
            plays: existing.plays + entry.plays,
            seconds: existing.seconds + entry.seconds,
          }
        : entry,
    );
  }
  return [...merged.values()];
}

/** Feeds "Ton mois en musique" for visitors and buffers writes for signed-in users. */
export const useListeningStore = create<ListeningState & ListeningActions>()(
  persist(
    (set, get) => ({
      ...emptyState,

      record(track, { plays, seconds }, at = new Date()) {
        if (plays <= 0 && seconds <= 0) return;
        const month = toMonthKey(at);
        const { months, pending } = get();
        const tracks = months[month] ?? {};
        const current = tracks[track.id];

        const nextMonths = {
          ...months,
          [month]: {
            ...tracks,
            [track.id]: {
              track,
              plays: (current?.plays ?? 0) + plays,
              seconds: (current?.seconds ?? 0) + seconds,
            },
          },
        };
        const kept = Object.keys(nextMonths).sort().slice(-MONTHS_KEPT);

        set({
          months: Object.fromEntries(kept.map((key) => [key, nextMonths[key] ?? {}])),
          pending: mergePending(pending, [
            {
              month,
              trackId: track.id,
              artistId: track.artist.id,
              genre: track.genre,
              plays,
              seconds,
            },
          ]),
        });
      },

      takePending() {
        const { pending } = get();
        set({ pending: [] });
        return pending;
      },

      restorePending(entries) {
        set({ pending: mergePending(get().pending, entries) });
      },

      clear() {
        set(emptyState);
      },
    }),
    {
      name: DEVICE_STORAGE_KEYS.listening,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Manual rehydration after mount (same reason as the library).
      skipHydration: true,
    },
  ),
);

export function localMonthRows(months: ListeningState["months"], month: string): ListeningRow[] {
  return Object.values(months[month] ?? {}).map(({ track, plays, seconds }) => ({
    trackId: track.id,
    artistId: track.artist.id,
    genre: track.genre,
    plays,
    seconds,
  }));
}
