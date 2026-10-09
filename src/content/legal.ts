/*
 * Faits juridiques partagés par les pages légales (mentions, confidentialité, cookies,
 * centre de confiance). Un seul endroit à mettre à jour si un prestataire change.
 * Ces textes sont des modèles sérieux, pas un avis juridique : ils sont à faire relire.
 */
import { siteConfig } from "@/config/site";
import { DEVICE_STORAGE_KEYS } from "@/lib/device-storage";

/** Date de dernière mise à jour commune aux pages légales. */
export const LEGAL_UPDATED_AT = "2026-10-09";

export const PUBLISHER = {
  name: "Mickael Cornelli",
  status: "Particulier, projet personnel à but non commercial",
  email: siteConfig.contactEmail,
} as const;

export const SITE_HOST = {
  name: "Cloudflare, Inc.",
  address: "101 Townsend Street, San Francisco, CA 94107, États-Unis",
  phone: "+1 650 319 8930",
  url: "https://www.cloudflare.com",
} as const;

export const DATA_HOST = {
  name: "Supabase Pte. Ltd.",
  address: "65 Chulia Street #38-02/03, OCBC Centre, Singapour 049513",
  dataLocation: "Paris, France (région eu-west-3)",
  url: "https://supabase.com",
} as const;

export interface ThirdParty {
  name: string;
  role: string;
  data: string;
  location: string;
  safeguard: string;
  policyUrl: string;
}

/** Services qui reçoivent des données personnelles quand on utilise Soniva. */
export const THIRD_PARTIES: readonly ThirdParty[] = [
  {
    name: "Supabase",
    role: "Sous-traitant : base de données et authentification",
    data: "Compte (identifiant, e-mail, nom, avatar), bibliothèque, historique, statistiques",
    location: "Données stockées à Paris ; accès possible depuis Singapour et les États-Unis",
    safeguard: "Clauses contractuelles types de la Commission européenne",
    policyUrl: "https://supabase.com/privacy",
  },
  {
    name: "Cloudflare",
    role: "Sous-traitant : hébergement et diffusion du site",
    data: "Adresse IP et données techniques de connexion",
    location: "Réseau mondial, société aux États-Unis",
    safeguard: "Data Privacy Framework UE–États-Unis",
    policyUrl: "https://www.cloudflare.com/privacypolicy/",
  },
  {
    name: "Google",
    role: "Connexion avec un compte Google (si tu la choisis)",
    data: "Identifiant, e-mail, nom et photo de profil",
    location: "Union européenne et États-Unis",
    safeguard: "Data Privacy Framework UE–États-Unis",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    name: "GitHub",
    role: "Connexion avec un compte GitHub (si tu la choisis)",
    data: "Identifiant, e-mail, nom et avatar",
    location: "États-Unis",
    safeguard: "Data Privacy Framework UE–États-Unis",
    policyUrl: "https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement",
  },
  {
    name: "Audius",
    role: "Service tiers indépendant : diffusion audio et images",
    data: "Adresse IP de ton navigateur, quand il charge un morceau ou une pochette",
    location: "Réseau décentralisé, nœuds dans le monde entier",
    safeguard: "Aucune donnée de compte transmise ; politique propre à Audius",
    policyUrl: "https://audius.co/legal/privacy-policy",
  },
];

export interface StorageEntry {
  name: string;
  type: "Cookie" | "Stockage local";
  purpose: string;
  duration: string;
}

export const STORAGE_ENTRIES: readonly StorageEntry[] = [
  {
    name: "sb-…-auth-token",
    type: "Cookie",
    purpose:
      "Garder ta session ouverte quand tu es connecté (parfois découpé en plusieurs cookies .0, .1…).",
    duration: "Jusqu'à la déconnexion, 400 jours au plus",
  },
  {
    name: "sb-…-auth-token-code-verifier",
    type: "Cookie",
    purpose: "Sécuriser l'échange avec Google ou GitHub pendant la connexion.",
    duration: "Le temps de la connexion",
  },
  {
    name: DEVICE_STORAGE_KEYS.player,
    type: "Stockage local",
    purpose: "Retrouver ta file d'attente, ton volume et tes réglages de lecture.",
    duration: "Jusqu'à effacement",
  },
  {
    name: DEVICE_STORAGE_KEYS.library,
    type: "Stockage local",
    purpose: "Garder favoris, artistes suivis et historique sur l'appareil, avec ou sans compte.",
    duration: "Jusqu'à effacement ; vidé à la déconnexion",
  },
  {
    name: DEVICE_STORAGE_KEYS.listening,
    type: "Stockage local",
    purpose: "Compter tes écoutes pour « Ton mois en musique », en attendant leur envoi au compte.",
    duration: "Deux mois glissants ; vidé à la déconnexion",
  },
];

export const CNIL = {
  name: "Commission nationale de l'informatique et des libertés (CNIL)",
  address: "3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07",
  url: "https://www.cnil.fr/fr/plaintes",
} as const;
