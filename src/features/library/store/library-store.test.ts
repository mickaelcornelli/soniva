import { beforeEach, describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { selectIsFavorite, useLibraryStore } from "./library-store";

const store = () => useLibraryStore.getState();

beforeEach(() => {
  useLibraryStore.setState(useLibraryStore.getInitialState(), true);
});

describe("favoris", () => {
  it("ajoute sans doublon, du plus récent au plus ancien", () => {
    store().addFavorite(makeTrack({ id: "a" }), "2026-10-01T00:00:00Z");
    store().addFavorite(makeTrack({ id: "b" }), "2026-10-02T00:00:00Z");
    store().addFavorite(makeTrack({ id: "a" }), "2026-10-03T00:00:00Z");

    expect(store().favorites.map((f) => f.track.id)).toEqual(["a", "b"]);
    expect(selectIsFavorite("b")(store())).toBe(true);
  });

  it("retire un favori et renvoie l'entrée pour pouvoir annuler", () => {
    store().addFavorite(makeTrack({ id: "a" }), "2026-10-01T00:00:00Z");

    const removed = store().removeFavorite("a");

    expect(removed?.addedAt).toBe("2026-10-01T00:00:00Z");
    expect(store().favorites).toEqual([]);
    expect(store().removeFavorite("a")).toBeUndefined();
  });
});

describe("historique", () => {
  it("remonte le morceau réécouté en tête, sans doublon", () => {
    store().recordPlay(makeTrack({ id: "a" }), "2026-10-01T10:00:00Z");
    store().recordPlay(makeTrack({ id: "b" }), "2026-10-01T11:00:00Z");
    store().recordPlay(makeTrack({ id: "a" }), "2026-10-01T12:00:00Z");

    expect(store().history.map((h) => h.track.id)).toEqual(["a", "b"]);
  });

  it("plafonne l'historique à 50 morceaux", () => {
    for (let i = 0; i < 60; i++) store().recordPlay(makeTrack({ id: `t${i}` }));

    expect(store().history).toHaveLength(50);
    expect(store().history[0]?.track.id).toBe("t59");
  });

  it("marque des écoutes comme synchronisées", () => {
    const entry = store().recordPlay(makeTrack({ id: "a" }));

    store().markPlaysSynced([entry.id]);

    expect(store().history[0]?.synced).toBe(true);
  });
});
