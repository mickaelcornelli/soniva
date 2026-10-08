import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ className = "size-4" }: { className?: string }) {
  return (
    <BadgeCheck
      role="img"
      aria-label="Artiste vérifié"
      className={`shrink-0 text-accent ${className}`}
    />
  );
}
