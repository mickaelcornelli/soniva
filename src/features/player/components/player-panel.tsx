"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { IconButton } from "@/components/ui/icon-button";
import type { Track } from "@/types/music";
import { NowPlaying } from "./now-playing";
import { ProgressSlider } from "./progress-slider";
import { QueueList } from "./queue-list";
import { TransportControls } from "./transport-controls";

interface PlayerPanelProps {
  track: Track;
  open: boolean;
  onClose: () => void;
}

/**
 * Panneau « en cours de lecture » : plein écran sur mobile (avec toutes les commandes),
 * tiroir latéral sur desktop (la barre affiche déjà les commandes, on y montre la file).
 * Le <dialog> natif gère le piège du focus et la touche Échap.
 */
export function PlayerPanel({ track, open, onClose }: PlayerPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Lecture en cours"
      onClose={onClose}
      // Un clic sur le fond (hors du contenu) ferme le panneau.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-night text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm md:ml-auto md:w-[26rem] md:border-l md:border-line"
    >
      <div className="flex h-full flex-col gap-6 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Lecture en cours</p>
          <IconButton icon={ChevronDown} label="Fermer le panneau" onClick={onClose} />
        </div>

        <div className="flex flex-col gap-5 md:hidden">
          <NowPlaying track={track} layout="large" onNavigate={onClose} />
          <ProgressSlider />
          <TransportControls size="lg" />
        </div>
        <div className="hidden md:block">
          <NowPlaying track={track} onNavigate={onClose} />
        </div>

        <QueueList />
      </div>
    </dialog>
  );
}
