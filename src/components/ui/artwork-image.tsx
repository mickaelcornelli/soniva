import { buildSquareSrcSet, pickArtworkUrl } from "@/lib/artwork";
import type { Artwork, ArtworkSize } from "@/types/music";

interface ArtworkImageProps {
  artwork: Artwork;
  /** Taille idéale ; on se rabat sur la plus proche disponible. */
  size: ArtworkSize;
  alt: string;
  className?: string;
  priority?: boolean;
  /**
   * Largeur affichée (attribut `sizes`) d'une image carrée. Active le choix de la
   * résolution par le navigateur : une grande pochette n'est plus téléchargée en 1000 px
   * quand elle s'affiche en 256 px.
   */
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
    // Les pochettes Audius sont servies par de nombreux nœuds de stockage aux domaines
    // variables : next/image exigerait de tous les autoriser et consommerait le quota
    // d'optimisation de l'hébergeur gratuit. Les tailles fournies par Audius suffisent.
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
