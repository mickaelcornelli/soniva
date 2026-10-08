import { describe, expect, it } from "vitest";
import { normalizePlaylistName } from "./playlist-name";

describe("normalizePlaylistName", () => {
  it("nettoie les espaces", () => {
    expect(normalizePlaylistName("  Routes   de nuit ")).toBe("Routes de nuit");
  });

  it("refuse un nom vide", () => {
    expect(normalizePlaylistName("   ")).toBeNull();
  });

  it("borne la longueur", () => {
    expect(normalizePlaylistName("a".repeat(150))).toHaveLength(100);
  });
});
