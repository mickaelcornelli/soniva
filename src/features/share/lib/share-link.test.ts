import { describe, expect, it, vi } from "vitest";
import { shareLink } from "./share-link";

const data = { title: "Night Drive", url: "https://soniva.app/track/D7KyD" };

describe("shareLink", () => {
  it("utilise le partage natif quand il est disponible", async () => {
    const share = vi.fn().mockResolvedValue(undefined);

    await expect(shareLink(data, { share })).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith(data);
  });

  it("considère la fermeture de la feuille de partage comme une annulation", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("annulé", "AbortError"));
    const writeText = vi.fn();

    await expect(shareLink(data, { share, clipboard: { writeText } })).resolves.toBe("cancelled");
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copie le lien sans partage natif", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await expect(shareLink(data, { clipboard: { writeText } })).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith(data.url);
  });

  it("copie le lien quand le partage natif refuse ces données", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const share = vi.fn();

    const outcome = await shareLink(data, {
      share,
      canShare: () => false,
      clipboard: { writeText },
    });

    expect(outcome).toBe("copied");
    expect(share).not.toHaveBeenCalled();
  });

  it("appelle les méthodes sur l'objet fourni, comme l'exige navigator", async () => {
    const capabilities = {
      share: vi.fn(function (this: unknown) {
        if (this !== capabilities) throw new TypeError("Illegal invocation");
        return Promise.resolve();
      }),
      canShare: vi.fn(function (this: unknown) {
        if (this !== capabilities) throw new TypeError("Illegal invocation");
        return true;
      }),
    };

    await expect(shareLink(data, capabilities)).resolves.toBe("shared");
  });

  it("échoue proprement sans aucune possibilité", async () => {
    await expect(shareLink(data, {})).resolves.toBe("failed");
    const writeText = vi.fn().mockRejectedValue(new Error("refusé"));
    await expect(shareLink(data, { clipboard: { writeText } })).resolves.toBe("failed");
  });
});
