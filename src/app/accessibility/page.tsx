import type { Metadata } from "next";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { LEGAL_UPDATED_AT, PUBLISHER } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Accessibilité",
  description: `Déclaration d'accessibilité de ${siteConfig.name} : état de conformité, mesures prises, limites connues et contact.`,
  path: routes.accessibility,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "engagement",
    title: "Engagement",
    content: (
      <p>
        {siteConfig.name} veut être utilisable par toutes et tous, au clavier, au lecteur
        d&apos;écran comme à la souris. En tant que projet personnel non commercial, il n&apos;est
        pas soumis à l&apos;obligation légale d&apos;accessibilité ; cette déclaration est faite
        volontairement, sur le modèle du référentiel général d&apos;amélioration de
        l&apos;accessibilité (RGAA 4.1).
      </p>
    ),
  },
  {
    id: "etat",
    title: "État de conformité",
    content: (
      <p>
        <strong>{siteConfig.name} est non conforme</strong> au RGAA 4.1 : aucun audit complet
        n&apos;a encore été réalisé, et le référentiel impose ce statut tant qu&apos;une évaluation
        n&apos;a pas mesuré le taux de conformité. Un audit est prévu avant la mise en ligne
        définitive.
      </p>
    ),
  },
  {
    id: "mesures",
    title: "Ce qui est déjà en place",
    content: (
      <ul>
        <li>Lien d&apos;évitement « Aller au contenu » en début de page.</li>
        <li>Navigation complète au clavier, avec un indicateur de focus bien visible.</li>
        <li>
          Titres hiérarchisés, zones de page et listes balisées pour les lecteurs d&apos;écran.
        </li>
        <li>Boutons du lecteur nommés, curseurs de progression et de volume accessibles.</li>
        <li>Animations réduites quand le système le demande.</li>
        <li>Textes contrastés sur fond sombre, mise en page adaptée du mobile au grand écran.</li>
      </ul>
    ),
  },
  {
    id: "limites",
    title: "Limites connues",
    content: (
      <ul>
        <li>
          Les pochettes et descriptions viennent d&apos;Audius : leur qualité dépend de ce que
          publient les artistes.
        </li>
        <li>
          Les morceaux n&apos;ont ni transcription ni sous-titres (musique, souvent sans paroles).
        </li>
        <li>
          L&apos;audit RGAA et des tests avec des technologies d&apos;assistance restent à mener.
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Signaler une difficulté",
    content: (
      <p>
        Si un contenu ou une fonction t&apos;est inaccessible, écris à{" "}
        <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a> en précisant la page,
        l&apos;appareil et l&apos;outil utilisés. Nous chercherons une solution ou une alternative.
      </p>
    ),
  },
  {
    id: "recours",
    title: "Voies de recours",
    content: (
      <p>
        Si tu n&apos;obtiens pas de réponse satisfaisante, tu peux saisir le{" "}
        <a href="https://formulaire.defenseurdesdroits.fr">Défenseur des droits</a> en ligne, ou par
        courrier gratuit : Défenseur des droits, Libre réponse 71120, 75342 Paris Cedex 07.
      </p>
    ),
  },
];

export default function AccessibilityPage() {
  return (
    <EditorialPage
      title="Déclaration d'accessibilité"
      updatedAt={LEGAL_UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
