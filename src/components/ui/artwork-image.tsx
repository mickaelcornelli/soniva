import type { Artwork, ArtworkSize } from "@/types/music";

interface ArtworkImageProps {
  artwork: Artwork;
  /** Taille idéale ; on se rabat sur la plus proche disponible. */
  size: ArtworkSize;
  alt: string;
  className?: string;
  priority?: boolean;
}

const FALLBACK_ORDER: Record<ArtworkSize, readonly ArtworkSize[]> = {
  small: ["small", "medium", "large"],
  medium: ["medium", "large", "small"],
  large: ["large", "medium", "small"],
};

export function pickArtworkUrl(artwork: Artwork, size: ArtworkSize): string | undefined {
  return FALLBACK_ORDER[size].map((candidate) => artwork[candidate]).find(Boolean);
}

export function ArtworkImage({ artwork, size, alt, className = "", priority }: ArtworkImageProps) {
  const src = pickArtworkUrl(artwork, size);

  if (!src) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className={`bg-linear-to-br from-raised to-line ${className}`}
      />
    );
  }

  return (
    // Les pochettes Audius sont servies par de nombreux nœuds de stockage aux domaines
    // variables : next/image exigerait de tous les autoriser et consommerait le quota
    // d'optimisation de l'hébergeur gratuit. Les tailles fournies par Audius suffisent.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`bg-raised object-cover ${className}`}
    />
  );
}
