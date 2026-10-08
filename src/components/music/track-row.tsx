"use client";

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { FavoriteButton } from "@/features/library/components/favorite-button";
import { Equalizer } from "@/features/player/components/equalizer";
import { useTrackPlayback } from "@/features/player/hooks/use-player";
import { usePlayerStore } from "@/features/player/store/player-store";
import { formatDuration } from "@/lib/format/duration";
import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";
import { ArtistLink } from "./artist-link";

interface TrackRowProps {
  track: Track;
  /** Position affichée (classement, ordre d'une playlist). */
  position: number;
  /** Lance la lecture de ce morceau (avec sa liste en file d'attente). */
  onPlay: () => void;
}

export function TrackRow({ track, position, onPlay }: TrackRowProps) {
  const playback = useTrackPlayback(track.id);
  const isPlaying = playback?.isPlaying ?? false;

  const handlePlay = () => (playback ? usePlayerStore.getState().togglePlay() : onPlay());
  const PlayIcon = isPlaying ? Pause : Play;

  return (
    // Le lien du titre est étiré sur toute la ligne (after:inset-0) ; le bouton de lecture
    // et le lien artiste passent au-dessus (relative z-10) pour rester cliquables.
    <div
      className={`group relative flex items-center gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-surface ${
        playback ? "bg-surface" : ""
      }`}
    >
      <span className="relative z-10 flex size-8 shrink-0 items-center justify-center">
        {/* Au repos : la position (ou l'égaliseur si le morceau est en cours). Au survol,
            au focus ou sur écran tactile : le bouton de lecture. */}
        <span
          aria-hidden="true"
          className="font-display text-sm font-semibold text-muted tabular-nums group-focus-within:opacity-0 group-hover:opacity-0 pointer-coarse:opacity-0"
        >
          {playback ? <Equalizer playing={isPlaying} /> : position}
        </span>
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`${isPlaying ? "Mettre en pause" : "Lire"} ${track.title}`}
          className="absolute inset-0 flex items-center justify-center rounded-full text-foreground opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 hover:text-accent focus-visible:opacity-100 pointer-coarse:opacity-100"
        >
          <PlayIcon aria-hidden="true" className="size-4" fill="currentColor" />
        </button>
      </span>
      <ArtworkImage
        artwork={track.artwork}
        size="small"
        alt=""
        className="size-12 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={routes.track(track.id)}
          className={`truncate font-medium after:absolute after:inset-0 after:rounded-xl ${
            playback ? "text-accent" : ""
          }`}
        >
          {track.title}
        </Link>
        <ArtistLink
          artist={track.artist}
          className="relative z-10 self-start text-sm text-muted"
          badgeClassName="size-3.5"
        />
      </div>
      <FavoriteButton track={track} revealOnHover className="relative z-10" />
      <span className="hidden shrink-0 text-sm text-muted sm:block">{track.genre}</span>
      <span className="w-12 shrink-0 text-right text-sm text-muted tabular-nums">
        {formatDuration(track.durationSeconds)}
      </span>
    </div>
  );
}
