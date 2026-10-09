import { beforeEach, describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { localMonthRows, useListeningStore } from "./listening-store";

const store = () => useListeningStore.getState();
const october = new Date(2026, 9, 9);

beforeEach(() => {
  useListeningStore.setState(useListeningStore.getInitialState(), true);
});

describe("journal d'écoute", () => {
  it("cumule les écoutes d'un morceau sur le mois", () => {
    const track = makeTrack({ id: "t1" });

    store().record(track, { plays: 1, seconds: 40 }, october);
    store().record(track, { plays: 0, seconds: 20 }, october);

    expect(localMonthRows(store().months, "2026-10")).toEqual([
      { trackId: "t1", artistId: "a1", genre: "Electronic", plays: 1, seconds: 60 },
    ]);
  });

  it("regroupe les écoutes en attente d'envoi par mois et par morceau", () => {
    const track = makeTrack({ id: "t1" });
    store().record(track, { plays: 1, seconds: 30 }, october);
    store().record(track, { plays: 1, seconds: 30 }, october);

    const pending = store().takePending();

    expect(pending).toEqual([
      {
        month: "2026-10",
        trackId: "t1",
        artistId: "a1",
        genre: "Electronic",
        plays: 2,
        seconds: 60,
      },
    ]);
    expect(store().pending).toEqual([]);

    store().restorePending(pending);
    expect(store().pending).toHaveLength(1);
  });

  it("ne garde que les deux mois les plus récents", () => {
    const track = makeTrack();
    store().record(track, { plays: 1, seconds: 10 }, new Date(2026, 7, 1));
    store().record(track, { plays: 1, seconds: 10 }, new Date(2026, 8, 1));
    store().record(track, { plays: 1, seconds: 10 }, october);

    expect(Object.keys(store().months).sort()).toEqual(["2026-09", "2026-10"]);
  });

  it("ignore une écoute vide", () => {
    store().record(makeTrack(), { plays: 0, seconds: 0 }, october);

    expect(store().pending).toEqual([]);
  });
});
