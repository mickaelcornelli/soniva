interface LogoMarkProps {
  className?: string;
}

/**
 * Monogramme Soniva : un S tracé comme une piste de console, qui émet un point
 * (le signal qui part). Même dessin que la favicon (`app/icon.svg`).
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="18" className="fill-accent" />
      <path
        d="M38 18H29a7.5 7.5 0 0 0 0 15h6a7.5 7.5 0 0 1 0 15H20"
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent-foreground"
      />
      <circle cx="46.5" cy="18" r="3.8" className="fill-accent-foreground" />
    </svg>
  );
}
