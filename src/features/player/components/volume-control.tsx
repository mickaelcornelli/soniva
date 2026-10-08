"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { usePlayerStore } from "../store/player-store";

export function VolumeControl() {
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const { setVolume, toggleMute } = usePlayerStore.getState();

  const effective = muted ? 0 : volume;
  const icon = effective === 0 ? VolumeX : effective < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-1">
      <IconButton
        icon={icon}
        label={muted ? "Réactiver le son" : "Couper le son"}
        onClick={toggleMute}
        size="sm"
      />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={effective}
        aria-label="Volume"
        aria-valuetext={`${Math.round(effective * 100)} %`}
        onChange={(event) => setVolume(Number(event.target.value))}
        className="h-1 w-24 cursor-pointer accent-accent"
      />
    </div>
  );
}
