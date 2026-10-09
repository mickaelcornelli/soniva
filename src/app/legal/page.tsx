import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { DATA_HOST, LEGAL_UPDATED_AT, PUBLISHER, SITE_HOST } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Mentions légales",
  description: `Éditeur, hébergeurs et propriété intellectuelle du site ${siteConfig.name}.`,
  path: routes.legal,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <ul>
        <li>
          <strong>{PUBLISHER.name}</strong> — {PUBLISHER.status}.
        </li>
        <li>Directeur de la publication : {PUBLISHER.name}.</li>
        <li>
          Contact : <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>
        </li>
      </ul>
    ),
  },
  {
    id: "hebergement",
    title: "Hébergement",
    content: (
      <>
        <h3>Site</h3>
        <p>
          {SITE_HOST.name}, {SITE_HOST.address}. Téléphone : {SITE_HOST.phone}.{" "}
          <a href={SITE_HOST.url}>cloudflare.com</a>
        </p>
        <h3>Données des comptes</h3>
        <p>
          {DATA_HOST.name}, {DATA_HOST.address}. Les données sont stockées à{" "}
          {DATA_HOST.dataLocation}. <a href={DATA_HOST.url}>supabase.com</a>
        </p>
      </>
    ),
  },
  {
    id: "musique",
    title: "Contenus musicaux",
    content: (
      <p>
        Les morceaux, pochettes, profils et playlists publics proviennent de la plateforme{" "}
        <a href="https://audius.co">Audius</a> et appartiennent à leurs auteurs. {siteConfig.name}{" "}
        les affiche et les diffuse sans les héberger ni les modifier. Pour signaler un contenu,
        consulte la page <Link href={routes.report}>Signaler un contenu</Link>.
      </p>
    ),
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    content: (
      <p>
        Le nom {siteConfig.name}, son logo, son identité visuelle et les textes du site sont la
        propriété de l&apos;éditeur. Les logiciels et polices tiers sont utilisés selon leurs
        licences, listées dans les <Link href={routes.credits}>crédits</Link>. Les marques citées
        (Audius, Google, GitHub, Facebook, Instagram, X…) appartiennent à leurs propriétaires.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    content: (
      <p>
        Le traitement de tes données est décrit dans la{" "}
        <Link href={routes.privacy}>politique de confidentialité</Link> et l&apos;usage des
        cookies dans la <Link href={routes.cookies}>politique cookies</Link>.
      </p>
    ),
  },
];

export default function LegalPage() {
  return (
    <EditorialPage
      title="Mentions légales"
      updatedAt={LEGAL_UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
