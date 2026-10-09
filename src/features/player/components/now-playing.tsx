"use client";

import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";

interface NowPlayingProps {
  track: Track;
  /** Appelé quand un lien est suivi (pour fermer un panneau, par exemple). */
  onNavigate?: () => void;
  layout?: "compact" | "large";
  /** Faux quand le bloc est déjà dans un bouton (un lien ne peut pas y être imbriqué). */
  linked?: boolean;
}

export function NowPlaying({
  track,
  onNavigate,
  layout = "compact",
  linked = true,
}: NowPlayingProps) {
  const large = layout === "large";
  // En format compact, les deux liens empilés sont rehaussés à 24 px de haut chacun :
  // c'est la taille minimale d'une cible tactile (WCAG 2.5.8).
  const titleClass = `truncate font-medium ${large ? "font-display text-xl" : "py-0.5 text-sm"}`;
  const artistClass = `truncate text-muted ${large ? "" : "py-1 text-xs"}`;

  return (
    <span className={`flex min-w-0 ${large ? "flex-col gap-5" : "items-center gap-3"}`}>
      <ArtworkImage
        artwork={track.artwork}
        size={large ? "large" : "small"}
        sizes={large ? "20rem" : undefined}
        alt=""
        className={
          large
            ? "aspect-square w-full max-w-80 self-center rounded-2xl shadow-[0_30px_80px_-30px] shadow-black"
            : "size-12 shrink-0 rounded-lg"
        }
      />
      <span className="flex min-w-0 flex-col">
        {linked ? (
          <>
            <Link
              href={routes.track(track.id)}
              onClick={onNavigate}
              className={`${titleClass} hover:underline`}
            >
              {track.title}
            </Link>
            <Link
              href={routes.artist(track.artist.handle)}
              onClick={onNavigate}
              className={`${artistClass} hover:text-foreground hover:underline`}
            >
              {track.artist.name}
            </Link>
          </>
        ) : (
          <>
            <span className={titleClass}>{track.title}</span>
            <span className={artistClass}>{track.artist.name}</span>
          </>
        )}
      </span>
    </span>
  );
}
