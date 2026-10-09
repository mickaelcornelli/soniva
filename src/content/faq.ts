export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: readonly FaqItem[];
}

export const FAQ: readonly FaqGroup[] = [
  {
    id: "ecouter",
    title: "Écouter de la musique",
    items: [
      {
        id: "gratuit",
        question: "Soniva est-il vraiment gratuit ?",
        answer:
          "Oui. Il n'y a ni abonnement, ni publicité, ni option payante. Soniva s'appuie sur des services gratuits et ne vend aucune donnée.",
      },
      {
        id: "origine",
        question: "D'où viennent les morceaux ?",
        answer:
          "De la plateforme Audius, où des artistes, souvent indépendants, publient leur musique. Soniva ne stocke aucun fichier audio : chaque écoute est diffusée directement par Audius.",
      },
      {
        id: "lecture-impossible",
        question: "Pourquoi un morceau ne se lance-t-il pas ?",
        answer:
          "Le morceau a peut-être été retiré par son artiste, ou le serveur Audius qui le diffuse est momentanément indisponible. Réessaie dans quelques minutes ou passe au morceau suivant.",
      },
      {
        id: "radio",
        question: "Que se passe-t-il à la fin de ma file d'attente ?",
        answer:
          "Si la radio est activée, elle prend le relais quand ta file touche à sa fin : elle la prolonge avec des morceaux proches de l'artiste et du genre que tu écoutes.",
      },
      {
        id: "telechargement",
        question: "Puis-je télécharger des morceaux pour les écouter hors ligne ?",
        answer:
          "Non. Les morceaux appartiennent à leurs artistes et Soniva n'a pas le droit de les distribuer en téléchargement.",
      },
    ],
  },
  {
    id: "compte",
    title: "Compte et bibliothèque",
    items: [
      {
        id: "compte-obligatoire",
        question: "Faut-il un compte pour écouter ?",
        answer:
          "Non. Tu peux écouter, ajouter des favoris et suivre des artistes sans compte : tout est alors gardé dans ce navigateur. Un compte sert à retrouver ta bibliothèque sur tous tes appareils.",
      },
      {
        id: "connexion",
        question: "Comment me connecter ?",
        answer:
          "Avec ton compte Google ou GitHub. Soniva ne gère aucun mot de passe : la connexion est confiée à ces services.",
      },
      {
        id: "synchronisation",
        question: "Que deviennent mes favoris si je me connecte après coup ?",
        answer:
          "Ils sont fusionnés avec ton compte à la connexion : rien de ce que tu avais ajouté sans compte n'est perdu.",
      },
      {
        id: "pour-toi",
        question: "Comment sont choisies les recommandations « Pour toi » ?",
        answer:
          "À partir de tes favoris et de ton historique d'écoute : Soniva en déduit tes genres et ton artiste dominants, puis cherche des morceaux proches. Ce calcul est fait dans ton navigateur, pas sur un serveur.",
      },
    ],
  },
  {
    id: "artistes",
    title: "Artistes et contenus",
    items: [
      {
        id: "apparaitre",
        question: "Je suis artiste : comment apparaître sur Soniva ?",
        answer:
          "Publie ta musique sur Audius. Ton profil et tes morceaux deviennent alors disponibles sur Soniva automatiquement, sans démarche supplémentaire.",
      },
      {
        id: "signaler",
        question: "Comment signaler un contenu ?",
        answer:
          "Écris-nous depuis la page Contact en indiquant le lien de la page concernée. Pour une question de droits d'auteur, le signalement doit aussi être adressé à Audius, qui héberge le morceau.",
      },
    ],
  },
];
