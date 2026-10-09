import {
  Accessibility,
  Cookie,
  FileText,
  Flag,
  type LucideIcon,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { DATA_HOST, LEGAL_UPDATED_AT, PUBLISHER } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Confidentialité et sécurité",
  description: `Comment ${siteConfig.name} protège tes données : aucun traceur, données hébergées à Paris, export et suppression en libre-service.`,
  path: routes.trust,
});

const COMMITMENTS = [
  "Aucune publicité, aucune mesure d'audience, aucun traceur tiers.",
  `Données des comptes hébergées à ${DATA_HOST.dataLocation}.`,
  "Aucun mot de passe stocké : connexion par Google ou GitHub.",
  "Chaque compte n'accède qu'à ses propres données, contrôle fait par la base elle-même.",
  "Export et suppression du compte en libre-service, sans avoir à écrire.",
  "Recommandations calculées dans ton navigateur.",
] as const;

const DOCUMENTS: readonly { href: string; title: string; description: string; icon: LucideIcon }[] =
  [
    {
      href: routes.privacy,
      title: "Politique de confidentialité",
      description: "Données, finalités, durées, prestataires et droits.",
      icon: ShieldCheck,
    },
    {
      href: routes.cookies,
      title: "Politique cookies",
      description: "La liste complète de ce qui est enregistré dans ton navigateur.",
      icon: Cookie,
    },
    {
      href: routes.terms,
      title: "Conditions d'utilisation",
      description: "Les règles d'usage du service.",
      icon: FileText,
    },
    {
      href: routes.legal,
      title: "Mentions légales",
      description: "Éditeur, hébergeurs et propriété intellectuelle.",
      icon: Scale,
    },
    {
      href: routes.accessibility,
      title: "Accessibilité",
      description: "Où en est Soniva, et comment signaler une difficulté.",
      icon: Accessibility,
    },
    {
      href: routes.report,
      title: "Signaler un contenu",
      description: "Contenu illicite, droits d'auteur ou faille de sécurité.",
      icon: Flag,
    },
  ];

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "engagements",
    title: "Nos engagements",
    content: (
      <ul>
        {COMMITMENTS.map((commitment) => (
          <li key={commitment}>{commitment}</li>
        ))}
      </ul>
    ),
  },
  {
    id: "controle",
    title: "Garder le contrôle",
    content: (
      <p>
        Depuis « Mes données », dans la <Link href={routes.library}>Bibliothèque</Link>, tu peux
        télécharger toutes tes données ou supprimer ton compte. Les{" "}
        <Link href={routes.cookieSettings}>paramètres des cookies</Link> permettent d&apos;effacer
        ce que {siteConfig.name} garde dans ce navigateur.
      </p>
    ),
  },
  {
    id: "documents",
    title: "Documents",
    content: (
      <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
        {DOCUMENTS.map(({ href, title, description, icon: Icon }) => (
          <li key={href} className="flex">
            <Link
              href={href}
              className="flex w-full gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-foreground/40"
            >
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" />
              <span className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">{title}</span>
                <span className="text-sm text-muted">{description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "faille",
    title: "Signaler une faille de sécurité",
    content: (
      <p>
        Tu as trouvé une vulnérabilité ? Écris à{" "}
        <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a> en décrivant le problème et la
        façon de le reproduire, et laisse-nous le temps de le corriger avant toute publication.
        N&apos;accède pas aux données d&apos;autres personnes pour le démontrer.
      </p>
    ),
  },
];

export default function TrustPage() {
  return (
    <EditorialPage
      title="Confidentialité et sécurité"
      description="Tout ce qu'il faut savoir sur tes données, au même endroit."
      updatedAt={LEGAL_UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
