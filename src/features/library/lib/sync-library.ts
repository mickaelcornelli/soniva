import type { Track } from "@/types/music";
import type { LibraryRepository } from "../api/library-repository";
import { useLibraryStore } from "../store/library-store";
import { buildFavorites, buildHistory, planFavoritesSync } from "./library-sync-plan";

interface SyncDependencies {
  repository: LibraryRepository;
  fetchTracks: (ids: readonly string[]) => Promise<Track[]>;
}

/**
 * Fusionne la bibliothèque de l'appareil avec celle du compte, à la connexion :
 * 1. envoie les favoris et écoutes faits sans compte (ou hors ligne) ;
 * 2. relit l'état du compte, qui devient la référence ;
 * 3. complète les métadonnées manquantes (favoris ajoutés depuis un autre appareil).
 */
export async function syncLibrary(userId: string, { repository, fetchTracks }: SyncDependencies) {
  const store = useLibraryStore.getState();
  // Données d'un autre compte sur cet appareil : on ne les mélange jamais.
  const local = store.ownerId === null || store.ownerId === userId ? store : null;
  const localFavorites = local?.favorites ?? [];
  const localHistory = local?.history ?? [];

  const remoteFavorites = await repository.listFavorites();
  const { toUpload, missingIds } = planFavoritesSync(localFavorites, remoteFavorites);
  await repository.addFavorites(toUpload);
  await repository.addPlays(
    localHistory
      .filter((play) => !play.synced)
      .map((play) => ({ trackId: play.track.id, playedAt: play.playedAt })),
  );
  const remotePlays = await repository.listPlays();

  const known = new Map<string, Track>();
  for (const { track } of [...localFavorites, ...localHistory]) known.set(track.id, track);
  const neededIds = [
    ...new Set([...missingIds, ...remotePlays.map((play) => play.trackId)]),
  ].filter((id) => !known.has(id));
  if (neededIds.length > 0) {
    for (const track of await fetchTracks(neededIds)) known.set(track.id, track);
  }

  useLibraryStore.getState().replace({
    ownerId: userId,
    favorites: buildFavorites([...remoteFavorites, ...toUpload], known),
    history: buildHistory(remotePlays, known),
  });
}
