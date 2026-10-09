import type { ListeningRepository } from "../api/listening-repository";
import { useListeningStore } from "../store/listening-store";

/**
 * Envoie au compte les écoutes en attente. En cas d'échec, elles sont remises en attente
 * et partiront au prochain envoi : rien n'est perdu, rien n'est compté deux fois.
 */
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
