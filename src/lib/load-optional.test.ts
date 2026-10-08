import { describe, expect, it, vi } from "vitest";
import { loadOptional } from "./load-optional";

describe("loadOptional", () => {
  it("renvoie la valeur chargée", async () => {
    await expect(loadOptional(async () => [1, 2], [], "test")).resolves.toEqual([1, 2]);
  });

  it("renvoie la valeur de repli et journalise l'erreur en cas d'échec", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      loadOptional(() => Promise.reject(new Error("boom")), [], "test"),
    ).resolves.toEqual([]);
    expect(consoleError).toHaveBeenCalledOnce();

    consoleError.mockRestore();
  });
});
