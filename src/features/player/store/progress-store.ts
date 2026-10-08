import { create } from "zustand";

/**
 * État de lecture à haute fréquence (plusieurs mises à jour par seconde).
 * Séparé du store principal pour ne pas déclencher sa persistance ni re-rendre
 * les composants qui n'affichent pas la progression.
 */
interface ProgressState {
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  setCurrentTime: (seconds: number) => void;
  setDuration: (seconds: number) => void;
  setBuffering: (isBuffering: boolean) => void;
  reset: (duration?: number) => void;
}

export const useProgressStore = create<ProgressState>()((set) => ({
  currentTime: 0,
  duration: 0,
  isBuffering: false,
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration: Number.isFinite(duration) ? duration : 0 }),
  setBuffering: (isBuffering) => set({ isBuffering }),
  reset: (duration = 0) => set({ currentTime: 0, duration, isBuffering: false }),
}));
