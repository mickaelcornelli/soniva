import { useLibraryStore } from "@/features/library/store/library-store";
import { usePlayerStore } from "@/features/player/store/player-store";
import { useListeningStore } from "@/features/stats/store/listening-store";
import { clearDeviceStorage } from "@/lib/device-storage";

/**
 * Stores are cleared before storage: writing afterwards would
 * restore their old data. The caller then reloads the page.
 */
export function wipeDeviceData(): void {
  usePlayerStore.getState().setPlaying(false);
  useLibraryStore.getState().clear();
  useListeningStore.getState().clear();
  clearDeviceStorage();
}
