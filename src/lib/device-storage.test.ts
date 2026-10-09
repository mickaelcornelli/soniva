import { describe, expect, it } from "vitest";
import { clearDeviceStorage, DEVICE_STORAGE_KEYS, readDeviceStorage } from "./device-storage";

function createStorage(entries: Record<string, string>): Storage {
  const data = new Map(Object.entries(entries));
  return {
    get length() {
      return data.size;
    },
    key: (index) => [...data.keys()][index] ?? null,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
    clear: () => data.clear(),
  };
}

describe("readDeviceStorage", () => {
  it("lit les clés de Soniva et ignore les autres ainsi que les valeurs corrompues", () => {
    const storage = createStorage({
      [DEVICE_STORAGE_KEYS.library]: JSON.stringify({ state: { favorites: [] } }),
      [DEVICE_STORAGE_KEYS.player]: "{pas du json",
      "autre-site": "1",
    });

    expect(readDeviceStorage(storage)).toEqual({
      [DEVICE_STORAGE_KEYS.library]: { state: { favorites: [] } },
    });
  });
});

describe("clearDeviceStorage", () => {
  it("efface les clés de Soniva sans toucher au reste", () => {
    const storage = createStorage({
      [DEVICE_STORAGE_KEYS.library]: "{}",
      [DEVICE_STORAGE_KEYS.listening]: "{}",
      "autre-site": "1",
    });

    clearDeviceStorage(storage);

    expect(storage.length).toBe(1);
    expect(storage.getItem("autre-site")).toBe("1");
  });
});
