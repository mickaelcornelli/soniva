import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Contacter ${siteConfig.name} : question, idée, problème technique ou signalement d'un contenu.`,
  path: routes.contact,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "avant",
    title: "Avant d'écrire",
    content: (
      <p>
        La réponse à ta question se trouve peut-être déjà dans l&apos;
        <Link href={routes.help}>aide et la FAQ</Link>.
      </p>
    ),
  },
  {
    id: "message",
    title: "Pour un message utile",
    content: (
      <ul>
        <li>Le lien de la page concernée (morceau, artiste, playlist…).</li>
        <li>Ce que tu attendais et ce qui s&apos;est passé à la place.</li>
        <li>Ton navigateur et ton appareil, en cas de problème technique.</li>
      </ul>
    ),
  },
  {
    id: "droits",
    title: "Droits d'auteur",
    content: (
      <p>
        Les morceaux sont hébergés par Audius. Si une œuvre t&apos;appartient et a été publiée sans
        ton accord, adresse aussi ta demande à <a href="https://audius.co">Audius</a> : un retrait
        chez eux la fait disparaître de {siteConfig.name}.
      </p>
    ),
  },
];

export default function ContactPage() {
  return (
    <EditorialPage
      title="Contact"
      description="Une question, une idée ou un problème ? Écris-nous."
      sections={SECTIONS}
      notice={
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="flex w-fit items-center gap-3 rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Mail aria-hidden="true" className="size-5" />
          {siteConfig.contactEmail}
        </a>
      }
    >
      <p className="text-muted">
        {siteConfig.name} est un projet personnel : la réponse peut prendre quelques jours.
      </p>
    </EditorialPage>
  );
}
