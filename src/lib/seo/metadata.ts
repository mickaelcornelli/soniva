import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Google truncates descriptions beyond this length. */
const MAX_DESCRIPTION_LENGTH = 160;

export function truncateDescription(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  const singleLine = text.replace(/\s+/g, " ").trim();
  if (singleLine.length <= max) return singleLine;
  return `${singleLine.slice(0, max - 1).trimEnd()}…`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string | undefined;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const text = truncateDescription(description);
  // A page-level `openGraph` replaces the layout's, so the default image must be set again.
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
      // Square covers: "summary" shows them whole instead of cropping to 2:1.
      card: image ? "summary" : "summary_large_image",
      title,
      description: text,
      images: [image ?? siteConfig.ogImage.url],
    },
  };
}
