import type { ListeningRepository } from "../api/listening-repository";
import { useListeningStore } from "../store/listening-store";

/** On failure, entries go back to pending: nothing is lost and nothing is counted twice. */
export async function flushListening(repository: ListeningRepository): Promise<void> {
  const entries = useListeningStore.getState().takePending();
  if (entries.length === 0) return;
  try {
    await repository.record(entries);
  } catch (error) {
    useListeningStore.getState().restorePending(entries);
    throw error;
  }
}
