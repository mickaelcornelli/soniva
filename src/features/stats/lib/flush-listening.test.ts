import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTrack } from "@/test/factories";
import { useListeningStore } from "../store/listening-store";
import { flushListening } from "./flush-listening";

beforeEach(() => {
  useListeningStore.setState(useListeningStore.getInitialState(), true);
  useListeningStore.getState().record(makeTrack({ id: "t1" }), { plays: 1, seconds: 30 });
});

describe("flushListening", () => {
  it("envoie les écoutes en attente puis les retire", async () => {
    const repository = { record: vi.fn().mockResolvedValue(undefined), listMonth: vi.fn() };

    await flushListening(repository);

    expect(repository.record).toHaveBeenCalledWith([expect.objectContaining({ trackId: "t1" })]);
    expect(useListeningStore.getState().pending).toEqual([]);
  });

  it("remet les écoutes en attente si l'envoi échoue", async () => {
    const repository = {
      record: vi.fn().mockRejectedValue(new Error("hors ligne")),
      listMonth: vi.fn(),
    };

    await expect(flushListening(repository)).rejects.toThrow("hors ligne");
    expect(useListeningStore.getState().pending).toHaveLength(1);
  });
});
