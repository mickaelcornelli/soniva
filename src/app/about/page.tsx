import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "À propos",
  description:
    "Soniva est une application gratuite de découverte musicale : la musique d'artistes indépendants publiée sur Audius, sans publicité ni abonnement.",
  path: routes.about,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "mission",
    title: "Faire découvrir, pas seulement écouter",
    content: (
      <>
        <p>
          {siteConfig.name} est né d&apos;une idée simple : la musique la plus intéressante est
          souvent celle qu&apos;on ne cherchait pas. Tendances, pages genre, recommandations et
          radio sont pensées pour t&apos;emmener un peu plus loin que tes habitudes.
        </p>
        <p>
          L&apos;interface reste sobre : un lecteur toujours à portée de main, des pages claires, et
          une couleur ambre réservée à ce qui joue.
        </p>
      </>
    ),
  },
  {
    id: "musique",
    title: "D'où vient la musique",
    content: (
      <>
        <p>
          Tous les morceaux viennent d&apos;<a href="https://audius.co">Audius</a>, une plateforme
          ouverte où les artistes publient eux-mêmes leur musique. {siteConfig.name} n&apos;héberge
          aucun fichier audio et ne modifie rien : chaque écoute est diffusée par Audius, et les
          droits restent à leurs artistes.
        </p>
        <p>
          Tu es artiste ? La page <Link href={routes.forArtists}>Pour les artistes</Link> explique
          comment apparaître sur {siteConfig.name}.
        </p>
      </>
    ),
  },
  {
    id: "gratuit",
    title: "Gratuit, pour de vrai",
    content: (
      <ul>
        <li>Aucun abonnement, aucune option payante.</li>
        <li>Aucune publicité et aucun traceur publicitaire.</li>
        <li>Aucune mesure d&apos;audience : Soniva ne suit pas ta navigation.</li>
        <li>
          Un compte est facultatif : il sert seulement à retrouver ta bibliothèque sur tous tes
          appareils.
        </li>
      </ul>
    ),
  },
  {
    id: "technique",
    title: "Comment c'est construit",
    content: (
      <>
        <p>
          {siteConfig.name} est une application web écrite en TypeScript avec Next.js et React,
          stylée avec Tailwind CSS. Le lecteur s&apos;appuie sur Zustand, les données distantes sur
          TanStack Query, et les comptes utilisateurs sur Supabase.
        </p>
        <p>
          Le fournisseur de musique est isolé derrière une interface : Audius pourrait être remplacé
          ou complété par un autre catalogue sans réécrire l&apos;application. Le détail des outils
          utilisés figure dans les <Link href={routes.credits}>crédits et licences</Link>.
        </p>
      </>
    ),
  },
  {
    id: "portfolio",
    title: "Un projet portfolio",
    content: (
      <p>
        {siteConfig.name} est un projet personnel, conçu et développé par Mickael Cornelli pour
        démontrer la conception d&apos;une application web complète. Une question, une idée ? La
        page <Link href={routes.contact}>Contact</Link> est là pour ça.
      </p>
    ),
  },
];

export default function AboutPage() {
  return (
    <EditorialPage
      title={`À propos de ${siteConfig.name}`}
      description="Une application gratuite pour découvrir la musique d'artistes indépendants."
      updatedAt="2026-10-09"
      sections={SECTIONS}
    />
  );
}
