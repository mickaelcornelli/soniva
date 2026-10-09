"use client";

import { useState } from "react";
import { formatDuration } from "@/lib/format/duration";
import { usePlayerStore } from "../store/player-store";
import { useProgressStore } from "../store/progress-store";

/**
 * While dragging, the displayed position follows the pointer; the seek
 * is only sent on release so audio isn't reloaded at every pixel.
 */
export function ProgressSlider({ className = "" }: { className?: string }) {
  const currentTime = useProgressStore((s) => s.currentTime);
  const duration = useProgressStore((s) => s.duration);
  const [draft, setDraft] = useState<number | null>(null);

  const value = Math.min(draft ?? currentTime, duration);

  function commit() {
    if (draft === null) return;
    usePlayerStore.getState().seek(draft);
    setDraft(null);
  }

  return (
    <div className={`flex items-center gap-3 text-xs text-muted tabular-nums ${className}`}>
      <span className="w-10 text-right">{formatDuration(value)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={value}
        disabled={duration === 0}
        aria-label="Position dans le morceau"
        aria-valuetext={`${formatDuration(value)} sur ${formatDuration(duration)}`}
        onChange={(event) => setDraft(Number(event.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
        className="h-1 min-w-0 flex-1 cursor-pointer accent-accent disabled:cursor-default"
      />
      <span className="w-10">{formatDuration(duration)}</span>
    </div>
  );
}
