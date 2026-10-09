import type { Artwork, ArtworkSize } from "@/types/music";

const FALLBACK_ORDER: Record<ArtworkSize, readonly ArtworkSize[]> = {
  small: ["small", "medium", "large"],
  medium: ["medium", "large", "small"],
  large: ["large", "medium", "small"],
};

/** Falls back to the closest available size. */
export function pickArtworkUrl(artwork: Artwork, size: ArtworkSize): string | undefined {
  return FALLBACK_ORDER[size].map((candidate) => artwork[candidate]).find(Boolean);
}

/**
 * Nominal width in pixels of each square image size.
 * Provider mappers follow it (Audius: 150, 480, 1000).
 */
export const SQUARE_ARTWORK_WIDTHS: Record<ArtworkSize, number> = {
  small: 150,
  medium: 480,
  large: 1000,
};

const SIZES_BY_WIDTH = Object.keys(SQUARE_ARTWORK_WIDTHS) as ArtworkSize[];

/** Lets the browser download the smallest size that stays sharp. Undefined with a single size. */
export function buildSquareSrcSet(artwork: Artwork): string | undefined {
  const candidates = SIZES_BY_WIDTH.flatMap((size) => {
    const url = artwork[size];
    return url ? [`${url} ${SQUARE_ARTWORK_WIDTHS[size]}w`] : [];
  });
  return candidates.length > 1 ? candidates.join(", ") : undefined;
}
