"use client";

import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import type { Track } from "@/types/music";
import { useFavorite } from "../hooks/use-favorite";

interface FavoriteButtonProps {
  track: Track;
  size?: "sm" | "md";
  className?: string;
  revealOnHover?: boolean;
}

export function FavoriteButton({
  track,
  size = "sm",
  className = "",
  revealOnHover = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorite(track);
  const visibility =
    revealOnHover && !isFavorite
      ? "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
      : "";

  return (
    <IconButton
      icon={Heart}
      label={
        isFavorite ? `Retirer ${track.title} des favoris` : `Ajouter ${track.title} aux favoris`
      }
      aria-pressed={isFavorite}
      active={isFavorite}
      filled={isFavorite}
      onClick={() => void toggle()}
      size={size}
      className={`${visibility} ${className}`}
    />
  );
}
