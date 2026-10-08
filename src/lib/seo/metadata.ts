import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Longueur au-delà de laquelle Google tronque la description dans ses résultats. */
const MAX_DESCRIPTION_LENGTH = 160;

export function truncateDescription(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  const singleLine = text.replace(/\s+/g, " ").trim();
  if (singleLine.length <= max) return singleLine;
  return `${singleLine.slice(0, max - 1).trimEnd()}…`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Chemin canonique de la page (ex. `/track/abc`). */
  path: string;
  image?: string | undefined;
}

/** Métadonnées SEO cohérentes pour toutes les pages publiques. */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const text = truncateDescription(description);
  // Un `openGraph` de page remplace celui du layout : l'image par défaut doit être redonnée ici.
  const images = image ? [{ url: image, alt: title }] : [siteConfig.ogImage];

  return {
    title,
    description: text,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      title,
      description: text,
      images,
    },
    twitter: {
      // Pochettes carrées : « summary » les affiche entières au lieu de les recadrer en 2:1.
      card: image ? "summary" : "summary_large_image",
      title,
      description: text,
      images: [image ?? siteConfig.ogImage.url],
    },
  };
}
