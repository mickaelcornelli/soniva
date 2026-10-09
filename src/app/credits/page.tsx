import type { Metadata } from "next";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { DataTable } from "@/components/ui/data-table";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Crédits et licences",
  description: `Les artistes, services et logiciels open source qui font ${siteConfig.name}, et le kit média de la marque.`,
  path: routes.credits,
});

interface Credit {
  name: string;
  role: string;
  license: string;
  url: string;
}

const SOFTWARE: readonly Credit[] = [
  { name: "Next.js", role: "Framework web", license: "MIT", url: "https://nextjs.org" },
  { name: "React", role: "Interface", license: "MIT", url: "https://react.dev" },
  {
    name: "TypeScript",
    role: "Langage",
    license: "Apache 2.0",
    url: "https://www.typescriptlang.org",
  },
  { name: "Tailwind CSS", role: "Styles", license: "MIT", url: "https://tailwindcss.com" },
  {
    name: "TanStack Query",
    role: "Données distantes",
    license: "MIT",
    url: "https://tanstack.com/query",
  },
  { name: "Zustand", role: "État du lecteur", license: "MIT", url: "https://zustand.docs.pmnd.rs" },
  { name: "Zod", role: "Validation", license: "MIT", url: "https://zod.dev" },
  {
    name: "Supabase JS",
    role: "Comptes et bibliothèque",
    license: "MIT",
    url: "https://supabase.com",
  },
  { name: "Lucide", role: "Icônes", license: "ISC", url: "https://lucide.dev" },
  {
    name: "Figtree",
    role: "Police de texte",
    license: "SIL OFL 1.1",
    url: "https://fonts.google.com/specimen/Figtree",
  },
  {
    name: "Unbounded",
    role: "Police de titres",
    license: "SIL OFL 1.1",
    url: "https://fonts.google.com/specimen/Unbounded",
  },
];

const COLORS = [
  { name: "Nuit", value: "#110f1e", className: "bg-night" },
  { name: "Surface", value: "#191629", className: "bg-surface" },
  { name: "Texte", value: "#eeebf8", className: "bg-foreground" },
  { name: "Ambre", value: "#ffb23f", className: "bg-accent" },
] as const;

const BRAND_FILES = [
  { label: "Monogramme (SVG)", href: "/brand/soniva-mark.svg" },
  { label: "Monogramme 512 px (PNG)", href: "/icons/icon-512.png" },
  { label: "Image de partage 1200 × 630 (PNG)", href: siteConfig.ogImage.url },
] as const;

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "musique",
    title: "Musique et données",
    content: (
      <p>
        Les morceaux, pochettes, profils et playlists appartiennent à leurs artistes et sont fournis
        par l&apos;API publique d&apos;<a href="https://audius.co">Audius</a>. {siteConfig.name} les
        affiche et les diffuse sans les modifier ni les stocker.
      </p>
    ),
  },
  {
    id: "services",
    title: "Services",
    content: (
      <ul>
        <li>
          <strong>Audius</strong> : catalogue musical et diffusion audio.
        </li>
        <li>
          <strong>Supabase</strong> : comptes et bibliothèque des utilisateurs connectés.
        </li>
        <li>
          <strong>Google et GitHub</strong> : connexion au compte.
        </li>
        <li>
          <strong>Cloudflare</strong> : hébergement du site.
        </li>
      </ul>
    ),
  },
  {
    id: "open-source",
    title: "Logiciels open source",
    content: (
      <>
        <p>
          {siteConfig.name} repose sur ces projets open source. Merci à celles et ceux qui les
          maintiennent.
        </p>
        <DataTable
          caption="Logiciels et polices utilisés, avec leur licence"
          columns={["Projet", "Rôle", "Licence"]}
          rows={SOFTWARE.map((item) => [
            <a key="lien" href={item.url}>
              {item.name}
            </a>,
            item.role,
            item.license,
          ])}
        />
      </>
    ),
  },
  {
    id: "kit-media",
    title: "Kit média",
    content: (
      <>
        <p>
          Le monogramme représente un « S » tracé comme une piste de console, qui émet un signal.
          Merci de ne pas le déformer, le recolorer ni l&apos;associer à un autre service.
        </p>
        <ul>
          {BRAND_FILES.map((file) => (
            <li key={file.href}>
              <a href={file.href} download>
                {file.label}
              </a>
            </li>
          ))}
        </ul>
        <h3>Couleurs</h3>
        <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
          {COLORS.map((color) => (
            <li key={color.value} className="flex flex-col gap-2">
              <span
                aria-hidden="true"
                className={`h-16 rounded-2xl border border-line ${color.className}`}
              />
              <span className="text-sm">
                <span className="font-medium text-foreground">{color.name}</span>{" "}
                <code className="text-muted">{color.value}</code>
              </span>
            </li>
          ))}
        </ul>
        <h3>Typographie</h3>
        <p>
          Unbounded pour les titres, Figtree pour le texte. L&apos;ambre est réservé à ce qui est
          actif ou en lecture.
        </p>
      </>
    ),
  },
];

export default function CreditsPage() {
  return (
    <EditorialPage
      title="Crédits et licences"
      description={`Ce qui fait ${siteConfig.name}, et comment parler de nous.`}
      updatedAt="2026-10-09"
      sections={SECTIONS}
    />
  );
}
