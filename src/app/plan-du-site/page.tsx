import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { footerNavigation, mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { GENRES } from "@/lib/genres";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Plan du site",
  description: `Toutes les pages de ${siteConfig.name} : découverte, genres, aide et informations.`,
  path: routes.siteMap,
});

interface SiteMapLink {
  href: string;
  label: string;
}

function LinkList({ links }: { links: readonly SiteMapLink[] }) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href}>{link.label}</Link>
        </li>
      ))}
    </ul>
  );
}

// Construit à partir des mêmes listes que la navigation : le plan reste à jour tout seul.
const SECTIONS: readonly EditorialSection[] = [
  {
    id: "decouvrir",
    title: "Découvrir",
    content: <LinkList links={mainNavigation} />,
  },
  {
    id: "genres",
    title: "Genres",
    content: (
      <LinkList
        links={GENRES.map((genre) => ({ href: routes.genre(genre.slug), label: genre.label }))}
      />
    ),
  },
  ...footerNavigation.map((column) => ({
    id: `plan-${column.id}`,
    title: column.title,
    content: <LinkList links={column.links} />,
  })),
];

export default function SiteMapPage() {
  return <EditorialPage title="Plan du site" sections={SECTIONS} />;
}
