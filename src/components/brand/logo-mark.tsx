interface LogoMarkProps {
  className?: string;
}

/** Monogramme Soniva : trois barres de niveau, comme un vumètre au repos. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" className="fill-accent" />
      <rect x="8" y="13" width="4" height="11" rx="2" className="fill-accent-foreground" />
      <rect x="14" y="7" width="4" height="17" rx="2" className="fill-accent-foreground" />
      <rect x="20" y="16" width="4" height="8" rx="2" className="fill-accent-foreground" />
    </svg>
  );
}
