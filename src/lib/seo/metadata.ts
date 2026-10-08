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
  const images = image ? [{ url: image, alt: title }] : undefined;

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
      card: image ? "summary_large_image" : "summary",
      title,
      description: text,
      images: image ? [image] : undefined,
    },
  };
}
