import type { Artist, Track } from "@/types/music";

export const HISTORY_SIZE = 50;

export interface FavoriteEntry {
  track: Track;
  addedAt: string;
}

export interface HistoryEntry {
  /** A track can be played several times. */
  id: string;
  track: Track;
  playedAt: string;
  synced: boolean;
}

export interface FollowEntry {
  artist: Artist;
  followedAt: string;
}

/** What the database stores: only track IDs and dates. */
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
 * Device favourites missing from the account must be uploaded;
 * account favourites missing from the device need their metadata.
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

/** A track appears once, at its latest play. */
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
