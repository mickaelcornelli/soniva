/*
 * FICTIONAL reviews. Labelled on screen, noindex, and no
 * rating or `Review` structured data is derived from them.
 */

export interface SampleReview {
  id: string;
  /** Made-up handle and no photo, so it never suggests a real person. */
  author: string;
  context: string;
  quote: string;
}

export const SAMPLE_REVIEWS: readonly SampleReview[] = [
  {
    id: "nuit-house",
    author: "Lumen_88",
    context: "Écoute surtout de la house",
    quote:
      "Les pages genre m'ont fait découvrir des producteurs que je n'aurais jamais croisés ailleurs. La radio qui enchaîne après la file, c'est exactement ce qu'il me fallait pour bosser.",
  },
  {
    id: "lofi-etudes",
    author: "camille.révise",
    context: "Étudiante, lo-fi pendant les révisions",
    quote:
      "Pas de pub, pas d'abonnement, et le lecteur reste en place quand je change de page. Simple et efficace.",
  },
  {
    id: "beatmaker",
    author: "K-Synth",
    context: "Beatmaker, publie sur Audius",
    quote:
      "Mes morceaux apparaissent sur Soniva sans rien faire de plus. Voir mes titres dans « Nouveautés » chez les gens qui me suivent, ça motive.",
  },
  {
    id: "mobile",
    author: "Théo dans le métro",
    context: "Écoute surtout sur mobile",
    quote:
      "L'interface mobile est claire et le lecteur compact ne gêne pas. J'aimerais pouvoir réordonner ma file d'attente, mais le reste est très agréable.",
  },
  {
    id: "stats",
    author: "Morgane_vinyl",
    context: "Aime suivre ses habitudes d'écoute",
    quote:
      "« Ton mois en musique » est devenu mon petit rituel. Voir mon artiste du mois et la répartition des genres, c'est ludique.",
  },
  {
    id: "jazz",
    author: "Blue Note Nomad",
    context: "Amateur de jazz",
    quote:
      "Le catalogue jazz est plus petit que sur les grosses plateformes, c'est normal avec des artistes indépendants. Mais ce que j'y trouve est souvent surprenant.",
  },
];
