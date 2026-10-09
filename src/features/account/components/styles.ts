export const PRIMARY_BUTTON =
  "inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const SECONDARY_BUTTON =
  "inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50";

/** Irreversible action: maximum contrast, distinct from the amber reserved for playback. */
export const DANGER_BUTTON =
  "inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-night transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";
