import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo/absolute-url";

export default function robots(): MetadataRoute.Robots {
  return {
    // La bibliothèque est personnelle : rien à indexer.
    rules: { userAgent: "*", allow: "/", disallow: routes.library },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
