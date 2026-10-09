import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { LEGAL_UPDATED_AT, PUBLISHER } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Conditions d'utilisation",
  description: `Les conditions générales d'utilisation de ${siteConfig.name}, service gratuit de découverte et d'écoute musicale.`,
  path: routes.terms,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "objet",
    title: "Objet",
    content: (
      <p>
        Ces conditions encadrent l&apos;utilisation de {siteConfig.name}, service gratuit de
        découverte et d&apos;écoute de musique publiée sur Audius, édité par {PUBLISHER.name}.
        Utiliser le site vaut acceptation de ces conditions.
      </p>
    ),
  },
  {
    id: "acces",
    title: "Accès au service",
    content: (
      <ul>
        <li>Le service est gratuit, sans abonnement ni publicité.</li>
        <li>L&apos;écoute ne demande aucun compte.</li>
        <li>
          Le service est fourni tel quel, sans garantie de disponibilité : il peut être interrompu
          pour maintenance, évoluer ou s&apos;arrêter.
        </li>
        <li>
          La disponibilité des morceaux dépend d&apos;Audius et de leurs artistes, qui peuvent les
          retirer à tout moment.
        </li>
      </ul>
    ),
  },
  {
    id: "compte",
    title: "Compte",
    content: (
      <ul>
        <li>
          Le compte est facultatif et se crée avec Google ou GitHub. Il est réservé aux personnes de
          15 ans et plus, ou avec l&apos;accord d&apos;un parent.
        </li>
        <li>Tu es responsable de l&apos;accès à ton compte Google ou GitHub.</li>
        <li>
          Tu peux supprimer ton compte à tout moment depuis « Mes données », dans la{" "}
          <Link href={routes.library}>Bibliothèque</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "usage",
    title: "Règles d'usage",
    content: (
      <>
        <p>En utilisant {siteConfig.name}, tu t&apos;engages à ne pas :</p>
        <ul>
          <li>télécharger, copier ou redistribuer les morceaux en dehors du service ;</li>
          <li>
            extraire massivement des données ou surcharger le service par des requêtes automatisées
            ;
          </li>
          <li>
            tenter d&apos;accéder aux données d&apos;autres personnes ou de contourner la sécurité ;
          </li>
          <li>donner à tes playlists des noms ou descriptions illicites ou injurieux.</li>
        </ul>
        <p>
          Un compte qui ne respecte pas ces règles peut être suspendu ou supprimé, après un
          avertissement sauf urgence.
        </p>
      </>
    ),
  },
  {
    id: "contenus",
    title: "Contenus et propriété intellectuelle",
    content: (
      <p>
        La musique, les pochettes et les profils appartiennent à leurs artistes et sont fournis par
        Audius. L&apos;écoute est permise pour un usage personnel, dans le cadre du service. Le nom,
        le logo et l&apos;interface de {siteConfig.name} appartiennent à son éditeur. Pour signaler
        un contenu, consulte la page <Link href={routes.report}>Signaler un contenu</Link>.
      </p>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    content: (
      <p>
        {siteConfig.name} ne contrôle pas les contenus publiés sur Audius et ne peut en garantir
        l&apos;exactitude ni la licéité. L&apos;éditeur traite promptement les signalements de
        contenus manifestement illicites et les transmet à Audius. Sa responsabilité ne saurait être
        engagée pour une interruption du service ou une perte de données locales.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    content: (
      <p>
        Leur traitement est décrit dans la{" "}
        <Link href={routes.privacy}>politique de confidentialité</Link>.
      </p>
    ),
  },
  {
    id: "modifications",
    title: "Modifications et droit applicable",
    content: (
      <p>
        Ces conditions peuvent évoluer ; la date de mise à jour figure en haut de page. Elles sont
        soumises au droit français. En cas de litige, une solution amiable sera recherchée avant
        toute action, en écrivant à <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <EditorialPage
      title="Conditions d'utilisation"
      updatedAt={LEGAL_UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
