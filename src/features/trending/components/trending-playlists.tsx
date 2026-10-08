import { PlaylistCard } from "@/components/music/playlist-card";
import type { Playlist } from "@/types/music";

export function TrendingPlaylists({ playlists }: { playlists: readonly Playlist[] }) {
  if (playlists.length === 0) return null;

  return (
    <section aria-labelledby="playlists-tendance" className="flex flex-col gap-4">
      <h2 id="playlists-tendance" className="font-display text-xl font-semibold">
        Playlists à découvrir
      </h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <PlaylistCard playlist={playlist} />
          </li>
        ))}
      </ul>
    </section>
  );
}
