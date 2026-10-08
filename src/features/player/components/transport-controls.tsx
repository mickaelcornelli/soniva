"use client";

import { Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { usePlayerStore } from "../store/player-store";
import { useProgressStore } from "../store/progress-store";
import { PlayPauseButton } from "./play-pause-button";

const REPEAT_LABELS = {
  off: "Activer la répétition de la file",
  all: "Répéter le morceau en cours",
  one: "Désactiver la répétition",
} as const;

interface TransportControlsProps {
  /** Affiche aussi aléatoire et répétition. */
  withModes?: boolean;
  size?: "md" | "lg";
}

export function TransportControls({ withModes = true, size = "md" }: TransportControlsProps) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const isBuffering = useProgressStore((s) => s.isBuffering);
  const { togglePlay, next, previous, toggleShuffle, cycleRepeat } = usePlayerStore.getState();

  return (
    <div className={`flex items-center justify-center ${size === "lg" ? "gap-5" : "gap-2"}`}>
      {withModes ? (
        <IconButton
          icon={Shuffle}
          label={shuffle ? "Désactiver la lecture aléatoire" : "Activer la lecture aléatoire"}
          aria-pressed={shuffle}
          active={shuffle}
          onClick={toggleShuffle}
          size="sm"
        />
      ) : null}
      <IconButton icon={SkipBack} label="Morceau précédent" onClick={previous} />
      <PlayPauseButton
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        onClick={togglePlay}
        size={size === "lg" ? "lg" : "sm"}
      />
      <IconButton icon={SkipForward} label="Morceau suivant" onClick={next} />
      {withModes ? (
        <IconButton
          icon={repeat === "one" ? Repeat1 : Repeat}
          label={REPEAT_LABELS[repeat]}
          active={repeat !== "off"}
          onClick={cycleRepeat}
          size="sm"
        />
      ) : null}
    </div>
  );
}
