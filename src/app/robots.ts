import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo/absolute-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [routes.library, routes.login, "/auth/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
