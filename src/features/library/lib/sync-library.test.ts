import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTrack } from "@/test/factories";
import type { LibraryRepository } from "../api/library-repository";
import { useLibraryStore } from "../store/library-store";
import { syncLibrary } from "./sync-library";

function makeRepository(overrides: Partial<LibraryRepository> = {}): LibraryRepository {
  return {
    listFavorites: vi.fn().mockResolvedValue([]),
    addFavorites: vi.fn().mockResolvedValue(undefined),
    removeFavorite: vi.fn().mockResolvedValue(undefined),
    listPlays: vi.fn().mockResolvedValue([]),
    addPlays: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

beforeEach(() => {
  useLibraryStore.setState(useLibraryStore.getInitialState(), true);
});

describe("syncLibrary", () => {
  it("envoie les favoris du visiteur et récupère ceux du compte", async () => {
    useLibraryStore.getState().addFavorite(makeTrack({ id: "local" }), "2026-10-02T00:00:00Z");
    const repository = makeRepository({
      listFavorites: vi
        .fn()
        .mockResolvedValue([{ trackId: "remote", addedAt: "2026-10-01T00:00:00Z" }]),
    });
    const fetchTracks = vi.fn().mockResolvedValue([makeTrack({ id: "remote" })]);

    await syncLibrary("user-1", { repository, fetchTracks });

    expect(repository.addFavorites).toHaveBeenCalledWith([
      { trackId: "local", addedAt: "2026-10-02T00:00:00Z" },
    ]);
    expect(fetchTracks).toHaveBeenCalledWith(["remote"]);
    const state = useLibraryStore.getState();
    expect(state.ownerId).toBe("user-1");
    expect(state.favorites.map((f) => f.track.id)).toEqual(["local", "remote"]);
  });

  it("envoie les écoutes non synchronisées puis adopte l'historique du compte", async () => {
    const play = useLibraryStore
      .getState()
      .recordPlay(makeTrack({ id: "a" }), "2026-10-01T10:00:00Z");
    const repository = makeRepository({
      listPlays: vi.fn().mockResolvedValue([{ trackId: "a", playedAt: play.playedAt }]),
    });

    await syncLibrary("user-1", { repository, fetchTracks: vi.fn() });

    expect(repository.addPlays).toHaveBeenCalledWith([
      { trackId: "a", playedAt: "2026-10-01T10:00:00Z" },
    ]);
    expect(useLibraryStore.getState().history).toMatchObject([{ synced: true }]);
  });

  it("ignore les données locales d'un autre compte", async () => {
    useLibraryStore.setState({ ownerId: "someone-else" });
    useLibraryStore.getState().addFavorite(makeTrack({ id: "theirs" }));
    const repository = makeRepository();

    await syncLibrary("user-1", { repository, fetchTracks: vi.fn() });

    expect(repository.addFavorites).toHaveBeenCalledWith([]);
    expect(useLibraryStore.getState().favorites).toEqual([]);
  });
});
