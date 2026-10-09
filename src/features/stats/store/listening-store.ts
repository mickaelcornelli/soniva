import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Track } from "@/types/music";
import type { ListeningRow } from "../lib/summarize-month";
import { toMonthKey } from "../lib/month";

/** Mois conservés sur l'appareil : de quoi afficher ce mois-ci et le précédent. */
const MONTHS_KEPT = 2;

export interface TrackListening {
  track: Track;
  plays: number;
  seconds: number;
}

/** Écoutes pas encore envoyées au compte (ou faites sans compte, à envoyer à la connexion). */
export interface PendingListening extends ListeningRow {
  month: string;
}

interface ListeningState {
  /** Écoutes par mois (« AAAA-MM ») puis par morceau. */
  months: Record<string, Record<string, TrackListening>>;
  pending: PendingListening[];
}

interface ListeningActions {
  record: (track: Track, listened: { plays: number; seconds: number }, at?: Date) => void;
  /** Retire et renvoie les écoutes en attente, pour les envoyer. */
  takePending: () => PendingListening[];
  /** Remet des écoutes en attente après un échec d'envoi. */
  restorePending: (entries: readonly PendingListening[]) => void;
  clear: () => void;
}

const emptyState: ListeningState = { months: {}, pending: [] };

/** Additionne des écoutes du même morceau sur le même mois plutôt que d'empiler les lignes. */
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

/**
 * Journal d'écoute agrégé par mois, conservé sur l'appareil. Il alimente « Ton mois en
 * musique » pour un visiteur et sert de tampon d'envoi pour un compte.
 */
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
        // Les mois les plus anciens sont oubliés : seuls les plus récents s'affichent.
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
      name: "soniva-listening",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Réhydratation manuelle après le montage (même raison que la bibliothèque).
      skipHydration: true,
    },
  ),
);

/** Lignes d'un mois au format commun, à partir des écoutes de l'appareil. */
export function localMonthRows(months: ListeningState["months"], month: string): ListeningRow[] {
  return Object.values(months[month] ?? {}).map(({ track, plays, seconds }) => ({
    trackId: track.id,
    artistId: track.artist.id,
    genre: track.genre,
    plays,
    seconds,
  }));
}
