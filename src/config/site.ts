export const siteConfig = {
  name: "Soniva",
  tagline: "Découvre la musique autrement.",
  description:
    "Soniva est une application gratuite de découverte et de streaming musical : tendances, recherche, artistes, playlists et recommandations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  ogImage: {
    url: "/brand/og-default.png",
    width: 1200,
    height: 630,
    alt: "Soniva — Découvre la musique autrement.",
  },
  contactEmail: "mickaelcornelli.dev@gmail.com",
  /**
   * No social accounts yet: link to the platforms themselves
   * rather than to a namesake account owned by someone else.
   */
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
  },
} as const;
