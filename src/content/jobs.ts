/*
 * Offres d'emploi FICTIVES : Soniva est un projet portfolio et ne recrute pas.
 * La page qui les affiche le signale, n'est pas indexée et n'expose aucune donnée
 * structurée `JobPosting`, pour qu'aucune offre ne soit prise pour une vraie.
 */

export interface JobOffer {
  id: string;
  title: string;
  team: string;
  location: string;
  contract: string;
  summary: string;
  missions: readonly string[];
  profile: readonly string[];
}

export const JOB_OFFERS: readonly JobOffer[] = [
  {
    id: "developpeur-front-end",
    title: "Développeur·se front-end React / Next.js",
    team: "Produit",
    location: "Paris ou télétravail (France)",
    contract: "CDI",
    summary:
      "Tu fais évoluer l'interface de Soniva, du lecteur audio aux pages artistes, avec une attention constante à la performance et à l'accessibilité.",
    missions: [
      "Concevoir et livrer de nouvelles fonctionnalités, de la maquette à la mise en production.",
      "Faire vivre le lecteur global : file d'attente, lecture continue, Media Session.",
      "Garder un temps de chargement court sur mobile et de bons scores d'accessibilité.",
      "Écrire des tests utiles et relire le code de l'équipe.",
    ],
    profile: [
      "Une solide expérience de React et TypeScript ; Next.js App Router est un plus.",
      "Le goût du détail dans les interfaces et des états de chargement soignés.",
      "Une pratique concrète de l'accessibilité web (RGAA, WCAG).",
    ],
  },
  {
    id: "designer-produit",
    title: "Designer produit (UI / UX)",
    team: "Design",
    location: "Télétravail (France)",
    contract: "CDI",
    summary:
      "Tu définis comment on découvre la musique sur Soniva : parcours, interface et identité visuelle, sur desktop comme sur mobile.",
    missions: [
      "Imaginer les parcours de découverte : recommandations, genres, radio.",
      "Faire évoluer le système de design et ses composants.",
      "Mener des tests utilisateurs et en tirer des décisions claires.",
    ],
    profile: [
      "Un portfolio qui montre des produits numériques livrés, pas seulement des maquettes.",
      "Une aisance en design d'interface sombre et en typographie.",
      "Une sensibilité à l'accessibilité dès la conception.",
    ],
  },
  {
    id: "relations-artistes",
    title: "Chargé·e de relations artistes",
    team: "Communauté",
    location: "Paris",
    contract: "CDD 12 mois",
    summary:
      "Tu es le lien entre Soniva et les artistes indépendants qui publient sur Audius : tu les aides à être découverts et tu remontes leurs besoins.",
    missions: [
      "Repérer des artistes et les accompagner dans leur présence sur Soniva.",
      "Animer la page « Pour les artistes » et les contenus éditoriaux.",
      "Recueillir les retours des artistes et les partager avec l'équipe produit.",
    ],
    profile: [
      "Une bonne connaissance de la scène indépendante et des plateformes musicales.",
      "Une aisance à l'écrit comme à l'oral.",
      "Le sens de l'organisation et du suivi.",
    ],
  },
];
