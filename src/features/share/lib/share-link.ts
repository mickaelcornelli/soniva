export interface ShareTarget {
  title: string;
  url: string;
}

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/** Sous-ensemble de `navigator` utilisé, injectable pour les tests. */
export interface ShareCapabilities {
  share?: (data: ShareTarget) => Promise<void>;
  canShare?: (data: ShareTarget) => boolean;
  clipboard?: { writeText: (text: string) => Promise<void> };
}

/**
 * Partage natif quand le système le propose (mobile surtout), sinon copie du lien.
 * Fermer la feuille de partage n'est pas une erreur : rien n'est alors affiché.
 */
export async function shareLink(
  data: ShareTarget,
  capabilities: ShareCapabilities = navigator,
): Promise<ShareOutcome> {
  // Appels de méthode sur l'objet lui-même : détachées de `navigator`, ces fonctions
  // lèvent « Illegal invocation ».
  if (capabilities.share && (capabilities.canShare?.(data) ?? true)) {
    try {
      await capabilities.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Partage refusé par le navigateur (permissions, contexte) : on tente la copie.
    }
  }

  if (capabilities.clipboard) {
    try {
      await capabilities.clipboard.writeText(data.url);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}
