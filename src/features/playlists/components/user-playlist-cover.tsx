import { ArtworkImage } from "@/components/ui/artwork-image";
import type { Artwork } from "@/types/music";

interface UserPlaylistCoverProps {
  name: string;
  artwork?: Artwork | undefined;
  className?: string;
}

export function UserPlaylistCover({ name, artwork, className = "" }: UserPlaylistCoverProps) {
  if (artwork && (artwork.small || artwork.medium || artwork.large)) {
    return <ArtworkImage artwork={artwork} size="large" alt="" className={className} />;
  }
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-linear-to-br from-raised to-line font-display text-5xl font-bold text-accent ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
