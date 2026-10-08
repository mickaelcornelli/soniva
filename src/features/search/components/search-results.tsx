import { ArtistCard } from "@/components/music/artist-card";
import { PlaylistCard } from "@/components/music/playlist-card";
import { TrackList } from "@/components/music/track-list";
import type { SearchResults as SearchResultsData } from "@/types/music";

const SECTION_TITLE = "font-display text-xl font-semibold";
const CARD_GRID = "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5";

export function hasResults({ tracks, artists, playlists }: SearchResultsData): boolean {
  return tracks.length + artists.length + playlists.length > 0;
}

/** Résultats groupés par type ; une section vide n'est pas affichée. */
export function SearchResults({ results }: { results: SearchResultsData }) {
  const { tracks, artists, playlists } = results;

  return (
    <div className="flex flex-col gap-12">
      {tracks.length > 0 ? (
        <section aria-labelledby="resultats-morceaux" className="flex flex-col gap-4">
          <h2 id="resultats-morceaux" className={SECTION_TITLE}>
            Morceaux
          </h2>
          <TrackList tracks={tracks} labelledBy="resultats-morceaux" />
        </section>
      ) : null}

      {artists.length > 0 ? (
        <section aria-labelledby="resultats-artistes" className="flex flex-col gap-4">
          <h2 id="resultats-artistes" className={SECTION_TITLE}>
            Artistes
          </h2>
          <ul className={CARD_GRID}>
            {artists.map((artist) => (
              <li key={artist.id}>
                <ArtistCard artist={artist} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {playlists.length > 0 ? (
        <section aria-labelledby="resultats-playlists" className="flex flex-col gap-4">
          <h2 id="resultats-playlists" className={SECTION_TITLE}>
            Playlists
          </h2>
          <ul className={CARD_GRID}>
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <PlaylistCard playlist={playlist} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
