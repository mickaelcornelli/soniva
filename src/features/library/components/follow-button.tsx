"use client";

import { Check, Plus } from "lucide-react";
import type { Artist } from "@/types/music";
import { useFollow } from "../hooks/use-follow";

export function FollowButton({ artist }: { artist: Artist }) {
  const { isFollowing, toggle } = useFollow(artist);
  const Icon = isFollowing ? Check : Plus;

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? `Ne plus suivre ${artist.name}` : `Suivre ${artist.name}`}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${
        isFollowing
          ? "border-line text-foreground hover:border-muted"
          : "border-accent bg-accent text-accent-foreground hover:bg-accent/90"
      }`}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={2.4} />
      {isFollowing ? "Suivi" : "Suivre"}
    </button>
  );
}
