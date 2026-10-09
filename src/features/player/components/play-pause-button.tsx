"use client";

import { LoaderCircle, Pause, Play } from "lucide-react";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  isBuffering?: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  subject?: string;
  className?: string;
}

const SIZES = {
  sm: { button: "size-9", icon: "size-4" },
  md: { button: "size-11", icon: "size-5" },
  lg: { button: "size-16", icon: "size-7" },
} as const;

export function PlayPauseButton({
  isPlaying,
  isBuffering = false,
  onClick,
  size = "md",
  subject,
  className = "",
}: PlayPauseButtonProps) {
  const action = isPlaying ? "Mettre en pause" : "Lire";
  const label = subject ? `${action} ${subject}` : action;
  const Icon = isBuffering && isPlaying ? LoaderCircle : isPlaying ? Pause : Play;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none ${SIZES[size].button} ${className}`}
    >
      <Icon
        aria-hidden="true"
        className={`${SIZES[size].icon} ${isPlaying ? "" : "translate-x-px"} ${
          Icon === LoaderCircle ? "animate-spin" : ""
        }`}
        fill={Icon === LoaderCircle ? "none" : "currentColor"}
      />
    </button>
  );
}
