import type { Artwork, ArtworkSize } from "@/types/music";

const FALLBACK_ORDER: Record<ArtworkSize, readonly ArtworkSize[]> = {
  small: ["small", "medium", "large"],
  medium: ["medium", "large", "small"],
  large: ["large", "medium", "small"],
};

/** URL de la taille demandée, ou de la plus proche disponible. */
export function pickArtworkUrl(artwork: Artwork, size: ArtworkSize): string | undefined {
  return FALLBACK_ORDER[size].map((candidate) => artwork[candidate]).find(Boolean);
}
