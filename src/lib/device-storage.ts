/**
 * Clés du stockage local utilisées par Soniva. Une seule liste, reprise par les stores,
 * la politique cookies, l'export des données et l'effacement de l'appareil.
 */
export const DEVICE_STORAGE_KEYS = {
  player: "soniva-player",
  library: "soniva-library",
  listening: "soniva-listening",
} as const;

const ALL_KEYS = Object.values(DEVICE_STORAGE_KEYS);

/** Contenu du stockage local de Soniva, pour l'export ; les valeurs illisibles sont ignorées. */
export function readDeviceStorage(storage: Storage = localStorage): Record<string, unknown> {
  const content: Record<string, unknown> = {};
  for (const key of ALL_KEYS) {
    try {
      const raw = storage.getItem(key);
      if (raw !== null) content[key] = JSON.parse(raw) as unknown;
    } catch {
      // Stockage bloqué (navigation privée) ou valeur corrompue : rien à exporter pour cette clé.
    }
  }
  return content;
}

/** Supprime toutes les données que Soniva a enregistrées dans ce navigateur. */
export function clearDeviceStorage(storage: Storage = localStorage): void {
  for (const key of ALL_KEYS) {
    try {
      storage.removeItem(key);
    } catch {
      // Stockage bloqué : il n'y a alors rien d'enregistré à effacer.
    }
  }
}
