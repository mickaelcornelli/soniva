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
  /** Adresse unique pour l'aide, les signalements et les demandes liées aux données. */
  contactEmail: "mickaelcornelli.dev@gmail.com",
  /**
   * Soniva n'a pas encore de comptes sociaux : ces liens mènent aux plateformes
   * elles-mêmes, plutôt qu'à un compte homonyme qui appartiendrait à quelqu'un d'autre.
   * Le jour venu, il suffit de les remplacer ici.
   */
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
  },
} as const;
