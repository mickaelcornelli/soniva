/** Single list, reused by the stores, the cookie policy, the data export and the device wipe. */
export const DEVICE_STORAGE_KEYS = {
  player: "soniva-player",
  library: "soniva-library",
  listening: "soniva-listening",
} as const;

const ALL_KEYS = Object.values(DEVICE_STORAGE_KEYS);

/** Unreadable values are skipped. */
export function readDeviceStorage(storage: Storage = localStorage): Record<string, unknown> {
  const content: Record<string, unknown> = {};
  for (const key of ALL_KEYS) {
    try {
      const raw = storage.getItem(key);
      if (raw !== null) content[key] = JSON.parse(raw) as unknown;
    } catch {
      // Storage blocked (private mode) or corrupted value: nothing to export.
    }
  }
  return content;
}

export function clearDeviceStorage(storage: Storage = localStorage): void {
  for (const key of ALL_KEYS) {
    try {
      storage.removeItem(key);
    } catch {
      // Storage blocked: nothing was saved.
    }
  }
}
