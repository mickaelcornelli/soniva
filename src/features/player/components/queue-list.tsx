"use client";

import { Radio, X } from "lucide-react";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { IconButton } from "@/components/ui/icon-button";
import { formatDuration } from "@/lib/format/duration";
import { usePlayerStore } from "../store/player-store";
import { Equalizer } from "./equalizer";

export function QueueList() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const radio = usePlayerStore((s) => s.radio);
  const { playQueueItem, removeFromQueue, toggleRadio } = usePlayerStore.getState();

  const upcoming = queue.length - currentIndex - 1;

  return (
    <section aria-labelledby="file-attente" className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="file-attente" className="font-display text-lg font-semibold">
          File d&apos;attente
          <span className="ml-2 font-sans text-sm font-normal text-muted">
            {upcoming > 0 ? `${upcoming} à suivre` : "Rien à suivre"}
          </span>
        </h2>
        <button
          type="button"
          onClick={toggleRadio}
          aria-pressed={radio}
          title="Enchaîner des morceaux proches à la fin de la file"
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            radio
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-line text-muted hover:text-foreground"
          }`}
        >
          <Radio aria-hidden="true" className="size-3.5" />
          Radio
        </button>
      </div>
      <p className="-mt-2 text-xs text-muted">
        {radio
          ? "La radio prolonge la file avec des morceaux proches."
          : "La lecture s'arrête à la fin de la file."}
      </p>
      <ol aria-labelledby="file-attente" className="-mx-2 flex flex-col overflow-y-auto">
        {queue.map(({ queueId, track }, index) => {
          const isCurrent = index === currentIndex;
          return (
            <li
              key={queueId}
              className={`group flex items-center gap-3 rounded-xl px-2 py-1.5 ${
                isCurrent ? "bg-surface" : "hover:bg-surface"
              } ${index < currentIndex ? "opacity-50" : ""}`}
            >
              <button
                type="button"
                onClick={() => playQueueItem(index)}
                aria-current={isCurrent ? "true" : undefined}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <ArtworkImage
                  artwork={track.artwork}
                  size="small"
                  alt=""
                  className="size-10 shrink-0 rounded-md"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={`truncate text-sm font-medium ${isCurrent ? "text-accent" : ""}`}
                  >
                    {track.title}
                  </span>
                  <span className="truncate text-xs text-muted">{track.artist.name}</span>
                </span>
                {isCurrent ? (
                  <Equalizer playing={isPlaying} />
                ) : (
                  <span className="text-xs text-muted tabular-nums">
                    {formatDuration(track.durationSeconds)}
                  </span>
                )}
              </button>
              {isCurrent ? null : (
                <IconButton
                  icon={X}
                  label={`Retirer ${track.title} de la file`}
                  onClick={() => removeFromQueue(queueId)}
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
