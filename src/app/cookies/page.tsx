import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { DataTable } from "@/components/ui/data-table";
import { siteConfig } from "@/config/site";
import { LEGAL_UPDATED_AT, STORAGE_ENTRIES } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Politique cookies",
  description: `${siteConfig.name} n'utilise que des cookies et un stockage local strictement nécessaires : ni publicité, ni mesure d'audience, ni traceur tiers.`,
  path: routes.cookies,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "principe",
    title: "En bref",
    content: (
      <>
        <p>
          Un cookie, ou une donnée du stockage local, est un petit fichier que le site enregistre
          dans ton navigateur. {siteConfig.name} s&apos;en sert uniquement pour faire fonctionner ce
          que tu utilises : ta session, ton lecteur et ta bibliothèque.
        </p>
        <p>
          Ces usages sont strictement nécessaires au service que tu demandes : la loi ne les soumet
          pas à ton consentement, c&apos;est pourquoi aucun bandeau ne s&apos;affiche.
        </p>
      </>
    ),
  },
  {
    id: "liste",
    title: "Ce qui est enregistré",
    content: (
      <DataTable
        caption="Cookies et données du stockage local utilisés par Soniva"
        columns={["Nom", "Type", "Rôle", "Durée"]}
        rows={STORAGE_ENTRIES.map((entry) => [
          <code key="nom">{entry.name}</code>,
          entry.type,
          entry.purpose,
          entry.duration,
        ])}
      />
    ),
  },
  {
    id: "absents",
    title: "Ce qui n'est pas utilisé",
    content: (
      <ul>
        <li>Aucun cookie publicitaire.</li>
        <li>Aucune mesure d&apos;audience ni statistique de visite.</li>
        <li>Aucun bouton de partage ou module de réseau social qui te suivrait.</li>
        <li>Les polices de caractères sont servies par {siteConfig.name} lui-même.</li>
      </ul>
    ),
  },
  {
    id: "tiers",
    title: "Services tiers",
    content: (
      <>
        <p>
          Les morceaux et les pochettes sont chargés directement depuis Audius, et ta photo de
          profil depuis Google ou GitHub : ton navigateur leur transmet alors ton adresse IP, sans
          que {siteConfig.name} y dépose de cookie.
        </p>
        <p>
          Pendant la connexion, tu passes quelques instants sur le site de Google ou de GitHub, qui
          appliquent leurs propres règles sur les cookies.
        </p>
      </>
    ),
  },
  {
    id: "gerer",
    title: "Gérer et effacer",
    content: (
      <p>
        Tu peux tout effacer en un clic depuis les{" "}
        <Link href={routes.cookieSettings}>paramètres des cookies</Link>, ou depuis les réglages de
        ton navigateur. Effacer ces données te déconnecte et vide la bibliothèque gardée sur
        l&apos;appareil ; ton compte, lui, reste intact.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <EditorialPage
      title="Politique cookies"
      description="Le strict nécessaire, rien de plus."
      updatedAt={LEGAL_UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
