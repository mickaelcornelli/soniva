import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Track } from "@/types/music";
import { DEVICE_STORAGE_KEYS } from "@/lib/device-storage";
import {
  createQueueItems,
  getNextIndex,
  getPreviousIndex,
  type QueueItem,
  type RepeatMode,
  restoreOrder,
  shuffle,
  shuffleUpcoming,
} from "../lib/queue";
import { useProgressStore } from "./progress-store";

/** Before this many seconds, "previous" changes track; after, it restarts the current one. */
const RESTART_THRESHOLD_SECONDS = 3;
const NO_TRACK = -1;

export interface PlayerState {
  queue: QueueItem[];
  currentIndex: number;
  /** Original order, kept while shuffled so it can be restored. */
  unshuffledQueue: QueueItem[] | null;
  /** Playback intent; the audio engine follows it. */
  isPlaying: boolean;
  /** Seek request for the audio engine, consumed then reset to null. */
  pendingSeek: number | null;
  error: string | null;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  radio: boolean;
}

export interface PlayerActions {
  playTracks: (tracks: readonly Track[], startIndex?: number) => void;
  playQueueItem: (index: number) => void;
  addToQueue: (track: Track) => void;
  extendQueue: (tracks: readonly Track[]) => void;
  removeFromQueue: (queueId: string) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  clearPendingSeek: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleRadio: () => void;
  handleEnded: () => void;
  handleError: (message: string) => void;
}

export type PlayerStore = PlayerState & PlayerActions;

const NEXT_REPEAT_MODE: Record<RepeatMode, RepeatMode> = { off: "all", all: "one", one: "off" };

const initialState: PlayerState = {
  queue: [],
  currentIndex: NO_TRACK,
  unshuffledQueue: null,
  isPlaying: false,
  pendingSeek: null,
  error: null,
  volume: 0.8,
  muted: false,
  shuffle: false,
  repeat: "off",
  radio: true,
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => {
      function goTo(index: number) {
        const item = get().queue[index];
        if (!item) return;
        useProgressStore.getState().reset(item.track.durationSeconds);
        set({ currentIndex: index, isPlaying: true, pendingSeek: null, error: null });
      }

      function restartCurrent() {
        useProgressStore.getState().setCurrentTime(0);
        set({ pendingSeek: 0 });
      }

      return {
        ...initialState,

        playTracks(tracks, startIndex = 0) {
          const items = createQueueItems(tracks);
          const start = items[startIndex];
          if (!start) return;

          if (get().shuffle) {
            // When shuffled, the chosen track plays first, then the rest in random order.
            const others = items.filter((item) => item !== start);
            set({ queue: [start, ...shuffle(others)], unshuffledQueue: items });
            goTo(0);
          } else {
            set({ queue: items, unshuffledQueue: null });
            goTo(startIndex);
          }
        },

        playQueueItem(index) {
          goTo(index);
        },

        addToQueue(track) {
          const [item] = createQueueItems([track]);
          if (!item) return;
          const { queue, currentIndex } = get();
          set({ queue: [...queue, item] });
          // Empty queue: the added track becomes current without starting playback.
          if (currentIndex === NO_TRACK) {
            useProgressStore.getState().reset(track.durationSeconds);
            set({ currentIndex: 0 });
          }
        },

        extendQueue(tracks) {
          if (tracks.length === 0) return;
          set({ queue: [...get().queue, ...createQueueItems(tracks)] });
        },

        removeFromQueue(queueId) {
          const { queue, currentIndex } = get();
          const index = queue.findIndex((item) => item.queueId === queueId);
          // The current track can't be removed; skip to the next one first.
          if (index === NO_TRACK || index === currentIndex) return;
          set({
            queue: queue.filter((item) => item.queueId !== queueId),
            currentIndex: index < currentIndex ? currentIndex - 1 : currentIndex,
          });
        },

        togglePlay() {
          const { currentIndex, isPlaying } = get();
          if (currentIndex === NO_TRACK) return;
          set({ isPlaying: !isPlaying, error: null });
        },

        setPlaying(isPlaying) {
          set({ isPlaying });
        },

        next() {
          const { queue, currentIndex, repeat } = get();
          // "Repeat one" only applies to automatic advance.
          const index = getNextIndex(queue.length, currentIndex, repeat === "all" ? "all" : "off");
          if (index !== null) goTo(index);
        },

        previous() {
          const { queue, currentIndex, repeat } = get();
          if (useProgressStore.getState().currentTime > RESTART_THRESHOLD_SECONDS) {
            restartCurrent();
            return;
          }
          const index = getPreviousIndex(
            queue.length,
            currentIndex,
            repeat === "all" ? "all" : "off",
          );
          if (index === null) restartCurrent();
          else goTo(index);
        },

        seek(seconds) {
          const time = Math.max(0, seconds);
          useProgressStore.getState().setCurrentTime(time);
          set({ pendingSeek: time });
        },

        clearPendingSeek() {
          set({ pendingSeek: null });
        },

        setVolume(volume) {
          const clamped = Math.min(1, Math.max(0, volume));
          set({ volume: clamped, muted: clamped === 0 });
        },

        toggleMute() {
          const { muted, volume } = get();
          // Unmuting at zero volume would have no audible effect.
          set(muted && volume === 0 ? { muted: false, volume: 0.5 } : { muted: !muted });
        },

        toggleShuffle() {
          const { shuffle: isShuffled, queue, currentIndex, unshuffledQueue } = get();
          if (!isShuffled) {
            set({
              shuffle: true,
              unshuffledQueue: queue,
              queue: shuffleUpcoming(queue, currentIndex),
            });
            return;
          }
          const currentId = queue[currentIndex]?.queueId;
          const restored = restoreOrder(queue, unshuffledQueue ?? queue);
          set({
            shuffle: false,
            unshuffledQueue: null,
            queue: restored,
            currentIndex: restored.findIndex((item) => item.queueId === currentId),
          });
        },

        cycleRepeat() {
          set({ repeat: NEXT_REPEAT_MODE[get().repeat] });
        },

        toggleRadio() {
          set({ radio: !get().radio });
        },

        handleEnded() {
          const { queue, currentIndex, repeat } = get();
          if (repeat === "one") {
            restartCurrent();
            return;
          }
          const index = getNextIndex(queue.length, currentIndex, repeat);
          if (index !== null) {
            goTo(index);
            return;
          }
          // End of queue: stop and rewind the last track.
          set({ isPlaying: false });
          restartCurrent();
        },

        handleError(message) {
          set({ isPlaying: false, error: message });
        },
      };
    },
    {
      name: DEVICE_STORAGE_KEYS.player,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Manual rehydration after mount, so the server
      // render (no player) matches the first client render.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        const item = state?.queue[state.currentIndex];
        if (item) useProgressStore.getState().reset(item.track.durationSeconds);
      },
      partialize: ({
        queue,
        currentIndex,
        unshuffledQueue,
        volume,
        muted,
        shuffle,
        repeat,
        radio,
      }) => ({ queue, currentIndex, unshuffledQueue, volume, muted, shuffle, repeat, radio }),
    },
  ),
);

export const selectCurrentItem = (state: PlayerStore): QueueItem | undefined =>
  state.queue[state.currentIndex];
