import { create } from "zustand";

/**
 * High-frequency playback state, kept apart from the main store so it doesn't
 * trigger persistence or re-render components that don't show progress.
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
