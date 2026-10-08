export const siteConfig = {
  name: "Soniva",
  tagline: "Découvre la musique autrement.",
  description:
    "Soniva est une application gratuite de découverte et de streaming musical : tendances, recherche, artistes, playlists et recommandations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  /** Image de partage par défaut (1200×630), pour les pages sans visuel propre. */
  ogImage: {
    url: "/brand/og-default.png",
    width: 1200,
    height: 630,
    alt: "Soniva — Découvre la musique autrement.",
  },
} as const;
