import { useLibraryStore } from "@/features/library/store/library-store";
import { usePlayerStore } from "@/features/player/store/player-store";
import { useListeningStore } from "@/features/stats/store/listening-store";
import { clearDeviceStorage } from "@/lib/device-storage";

/**
 * Efface tout ce que Soniva garde dans ce navigateur. Les stores sont vidés avant le
 * stockage : s'ils écrivaient après coup, ils remettraient leurs anciennes données.
 * L'appelant recharge ensuite la page pour repartir d'un état neuf (lecteur compris).
 */
export function wipeDeviceData(): void {
  usePlayerStore.getState().setPlaying(false);
  useLibraryStore.getState().clear();
  useListeningStore.getState().clear();
  clearDeviceStorage();
}
