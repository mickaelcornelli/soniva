import type { Artist, Track } from "@/types/music";
import type { LibraryRepository } from "../api/library-repository";
import { useLibraryStore } from "../store/library-store";
import {
  buildFavorites,
  buildFollows,
  buildHistory,
  planFavoritesSync,
  planFollowsSync,
} from "./library-sync-plan";

interface SyncDependencies {
  repository: LibraryRepository;
  fetchTracks: (ids: readonly string[]) => Promise<Track[]>;
  fetchArtists: (ids: readonly string[]) => Promise<Artist[]>;
}

/**
 * Fusionne la bibliothèque de l'appareil avec celle du compte, à la connexion :
 * 1. envoie les favoris et écoutes faits sans compte (ou hors ligne) ;
 * 2. relit l'état du compte, qui devient la référence ;
 * 3. complète les métadonnées manquantes (ajouts faits depuis un autre appareil).
 */
export async function syncLibrary(
  userId: string,
  { repository, fetchTracks, fetchArtists }: SyncDependencies,
) {
  const store = useLibraryStore.getState();
  // Données d'un autre compte sur cet appareil : on ne les mélange jamais.
  const local = store.ownerId === null || store.ownerId === userId ? store : null;
  const localFavorites = local?.favorites ?? [];
  const localHistory = local?.history ?? [];
  const localFollows = local?.follows ?? [];

  const remoteFavorites = await repository.listFavorites();
  const { toUpload, missingIds } = planFavoritesSync(localFavorites, remoteFavorites);
  await repository.addFavorites(toUpload);
  await repository.addPlays(
    localHistory
      .filter((play) => !play.synced)
      .map((play) => ({ trackId: play.track.id, playedAt: play.playedAt })),
  );
  const remotePlays = await repository.listPlays();

  const remoteFollows = await repository.listFollows();
  const follows = planFollowsSync(localFollows, remoteFollows);
  await repository.addFollows(follows.toUpload);

  const known = new Map<string, Track>();
  for (const { track } of [...localFavorites, ...localHistory]) known.set(track.id, track);
  const neededIds = [
    ...new Set([...missingIds, ...remotePlays.map((play) => play.trackId)]),
  ].filter((id) => !known.has(id));
  if (neededIds.length > 0) {
    for (const track of await fetchTracks(neededIds)) known.set(track.id, track);
  }

  const knownArtists = new Map<string, Artist>(
    localFollows.map(({ artist }) => [artist.id, artist]),
  );
  if (follows.missingIds.length > 0) {
    for (const artist of await fetchArtists(follows.missingIds)) {
      knownArtists.set(artist.id, artist);
    }
  }

  useLibraryStore.getState().replace({
    ownerId: userId,
    favorites: buildFavorites([...remoteFavorites, ...toUpload], known),
    history: buildHistory(remotePlays, known),
    follows: buildFollows([...remoteFollows, ...follows.toUpload], knownArtists),
  });
}
