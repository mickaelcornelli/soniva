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

/**
 * Largeur nominale, en pixels, de chaque taille d'une image carrée (pochette, avatar).
 * Les mappers des providers s'y conforment (Audius : 150, 480 et 1000 px).
 */
export const SQUARE_ARTWORK_WIDTHS: Record<ArtworkSize, number> = {
  small: 150,
  medium: 480,
  large: 1000,
};

const SIZES_BY_WIDTH = Object.keys(SQUARE_ARTWORK_WIDTHS) as ArtworkSize[];

/**
 * `srcset` des tailles disponibles d'une image carrée : le navigateur télécharge la plus
 * petite qui reste nette à l'écran. Inutile (undefined) avec une seule taille.
 */
export function buildSquareSrcSet(artwork: Artwork): string | undefined {
  const candidates = SIZES_BY_WIDTH.flatMap((size) => {
    const url = artwork[size];
    return url ? [`${url} ${SQUARE_ARTWORK_WIDTHS[size]}w`] : [];
  });
  return candidates.length > 1 ? candidates.join(", ") : undefined;
}
