import type { Artist, Track } from "@/types/music";

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

export interface FollowEntry {
  artist: Artist;
  /** Date ISO à laquelle l'artiste a été suivi. */
  followedAt: string;
}

/** Ce que la base stocke : uniquement des identifiants de morceaux et des dates. */
export interface RemoteFavorite {
  trackId: string;
  addedAt: string;
}

export interface RemoteFollow {
  artistId: string;
  followedAt: string;
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

/** Artistes suivis à la connexion : même logique que les favoris. */
export function planFollowsSync(local: readonly FollowEntry[], remote: readonly RemoteFollow[]) {
  const remoteIds = new Set(remote.map((follow) => follow.artistId));
  const localIds = new Set(local.map((entry) => entry.artist.id));

  return {
    toUpload: local
      .filter((entry) => !remoteIds.has(entry.artist.id))
      .map((entry) => ({ artistId: entry.artist.id, followedAt: entry.followedAt })),
    missingIds: remote.filter((follow) => !localIds.has(follow.artistId)).map((f) => f.artistId),
  };
}

/** Reconstruit les artistes suivis, du plus récent au plus ancien. */
export function buildFollows(
  follows: readonly RemoteFollow[],
  artists: ReadonlyMap<string, Artist>,
): FollowEntry[] {
  return [...follows]
    .sort((a, b) => b.followedAt.localeCompare(a.followedAt))
    .flatMap(({ artistId, followedAt }) => {
      const artist = artists.get(artistId);
      return artist ? [{ artist, followedAt }] : [];
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
