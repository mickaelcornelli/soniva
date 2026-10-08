export const siteConfig = {
  name: "Soniva",
  tagline: "Découvre la musique autrement.",
  description:
    "Soniva est une application gratuite de découverte et de streaming musical : tendances, recherche, artistes, playlists et recommandations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
} as const;
