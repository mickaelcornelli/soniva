import { buildSquareSrcSet, pickArtworkUrl } from "@/lib/artwork";
import type { Artwork, ArtworkSize } from "@/types/music";

interface ArtworkImageProps {
  artwork: Artwork;
  size: ArtworkSize;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Enables srcset so a large cover isn't downloaded at 1000px when shown at 256px. */
  sizes?: string;
}

export function ArtworkImage({
  artwork,
  size,
  alt,
  className = "",
  priority,
  sizes,
}: ArtworkImageProps) {
  const src = pickArtworkUrl(artwork, size);
  const srcSet = sizes ? buildSquareSrcSet(artwork) : undefined;

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
    // Audius serves covers from many storage nodes with changing domains: next/image
    // would require allowing them all and would eat the free host's optimisation quota.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`bg-raised object-cover ${className}`}
    />
  );
}
