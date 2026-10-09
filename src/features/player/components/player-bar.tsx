"use client";

import { ListMusic, SkipForward } from "lucide-react";
import { useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { FavoriteButton } from "@/features/library/components/favorite-button";
import { AddToPlaylistButton } from "@/features/playlists/components/add-to-playlist-button";
import { useCurrentTrack } from "../hooks/use-player";
import { usePlayerStore } from "../store/player-store";
import { useProgressStore } from "../store/progress-store";
import { NowPlaying } from "./now-playing";
import { PlayPauseButton } from "./play-pause-button";
import { PlayerPanel } from "./player-panel";
import { ProgressSlider } from "./progress-slider";
import { TransportControls } from "./transport-controls";
import { VolumeControl } from "./volume-control";

/**
 * Desktop: full pill. Mobile: compact bar above the
 * tabs; tapping the track opens the full-screen panel.
 */
export function PlayerBar() {
  const track = useCurrentTrack();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const error = usePlayerStore((s) => s.error);
  const isBuffering = useProgressStore((s) => s.isBuffering);
  const [panelOpen, setPanelOpen] = useState(false);

  if (!track) return null;

  const { togglePlay, next } = usePlayerStore.getState();

  return (
    <>
      <section
        aria-label="Lecteur"
        className="fixed inset-x-2 bottom-[calc(var(--spacing-mobile-nav)+0.5rem)] z-30 md:inset-x-6 md:bottom-4 md:left-[calc(var(--spacing-rail)+1.5rem)]"
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-[0_20px_60px_-20px] shadow-black backdrop-blur-xl md:rounded-full">
          {error ? (
            <p role="alert" className="bg-accent/10 px-5 py-1 text-center text-xs text-accent">
              {error}
            </p>
          ) : null}

          <div className="relative flex items-center gap-2 p-2 md:hidden">
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              aria-label={`Ouvrir le lecteur : ${track.title}, ${track.artist.name}`}
              className="flex min-w-0 flex-1 text-left"
            >
              <NowPlaying track={track} linked={false} />
            </button>
            <FavoriteButton track={track} />
            <PlayPauseButton
              isPlaying={isPlaying}
              isBuffering={isBuffering}
              onClick={togglePlay}
              size="sm"
            />
            <IconButton icon={SkipForward} label="Morceau suivant" onClick={next} />
            <MobileProgressLine />
          </div>

          <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] items-center gap-6 py-2 pr-6 pl-2 md:grid">
            <div className="flex min-w-0 items-center gap-2">
              <NowPlaying track={track} />
              <FavoriteButton track={track} />
              <AddToPlaylistButton track={track} />
            </div>
            <div className="flex flex-col gap-1">
              <TransportControls />
              <ProgressSlider />
            </div>
            <div className="flex items-center justify-end gap-2">
              <VolumeControl />
              <IconButton
                icon={ListMusic}
                label="Afficher la file d'attente"
                onClick={() => setPanelOpen(true)}
              />
            </div>
          </div>
        </div>
      </section>

      <PlayerPanel track={track} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}

function MobileProgressLine() {
  const currentTime = useProgressStore((s) => s.currentTime);
  const duration = useProgressStore((s) => s.duration);
  const ratio = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-line">
      <span
        className="block h-full origin-left rounded-full bg-accent"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </span>
  );
}
