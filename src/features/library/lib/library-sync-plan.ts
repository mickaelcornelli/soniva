import type { Track } from "@/types/music";

/** Nombre de morceaux gardés dans « Écoutés récemment ». */
export const HISTORY_SIZE = 50;

export interface FavoriteEntry {
  track: Track;
  /** Date ISO d'ajout aux favoris. */
  addedAt: string;
}

export interface HistoryEntry {
  /** Identifiant local de l'écoute (un même morceau peut être écouté plusieurs fois). */
  id: string;
  track: Track;
  playedAt: string;
  /** Déjà enregistrée côté serveur. */
  synced: boolean;
}

/** Ce que la base stocke : uniquement des identifiants de morceaux et des dates. */
export interface RemoteFavorite {
  trackId: string;
  addedAt: string;
}

export interface RemotePlay {
  trackId: string;
  playedAt: string;
}

/**
 * Favoris à la connexion : ceux de l'appareil absents du compte sont à envoyer,
 * ceux du compte absents de l'appareil ont besoin de leurs métadonnées.
 */
export function planFavoritesSync(
  local: readonly FavoriteEntry[],
  remote: readonly RemoteFavorite[],
) {
  const remoteIds = new Set(remote.map((favorite) => favorite.trackId));
  const localIds = new Set(local.map((entry) => entry.track.id));

  return {
    toUpload: local
      .filter((entry) => !remoteIds.has(entry.track.id))
      .map((entry) => ({ trackId: entry.track.id, addedAt: entry.addedAt })),
    missingIds: remote.filter((favorite) => !localIds.has(favorite.trackId)).map((f) => f.trackId),
  };
}

/** Reconstruit les favoris, du plus récent au plus ancien, avec les morceaux connus. */
export function buildFavorites(
  favorites: readonly RemoteFavorite[],
  tracks: ReadonlyMap<string, Track>,
): FavoriteEntry[] {
  return [...favorites]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .flatMap(({ trackId, addedAt }) => {
      const track = tracks.get(trackId);
      return track ? [{ track, addedAt }] : [];
    });
}

/**
 * Reconstruit l'historique depuis le journal d'écoutes du compte : un morceau n'y figure
 * qu'une fois, à sa dernière écoute.
 */
export function buildHistory(
  plays: readonly RemotePlay[],
  tracks: ReadonlyMap<string, Track>,
): HistoryEntry[] {
  const seen = new Set<string>();
  return [...plays]
    .sort((a, b) => b.playedAt.localeCompare(a.playedAt))
    .flatMap(({ trackId, playedAt }) => {
      const track = tracks.get(trackId);
      if (!track || seen.has(trackId)) return [];
      seen.add(trackId);
      return [{ id: `${trackId}@${playedAt}`, track, playedAt, synced: true }];
    })
    .slice(0, HISTORY_SIZE);
}
