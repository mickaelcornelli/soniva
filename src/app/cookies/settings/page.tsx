import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { ClearDeviceDataButton } from "@/features/account/components/clear-device-data-button";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Paramètres des cookies",
    description: `Les catégories de cookies de ${siteConfig.name} et l'effacement des données de cet appareil.`,
    path: routes.cookieSettings,
  }),
  robots: { index: false, follow: true },
};

const CATEGORIES = [
  {
    id: "necessaires",
    title: "Strictement nécessaires",
    status: "Toujours actifs",
    description:
      "Session de connexion, lecteur, bibliothèque et écoutes gardés dans ce navigateur. Sans eux, le service ne fonctionne pas.",
  },
  {
    id: "audience",
    title: "Mesure d'audience",
    status: "Non utilisés",
    description: `${siteConfig.name} ne mesure pas ta navigation.`,
  },
  {
    id: "publicite",
    title: "Publicité et réseaux sociaux",
    status: "Non utilisés",
    description: `${siteConfig.name} n'affiche aucune publicité et n'intègre aucun traceur de réseau social.`,
  },
] as const;

export default function CookieSettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Paramètres des cookies"
        description="Il n'y a rien à accepter ni à refuser : Soniva n'utilise que le strict nécessaire."
      />

      <ul className="flex flex-col gap-3">
        {CATEGORIES.map((category) => (
          <li
            key={category.id}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">{category.title}</h2>
              <p className="text-sm text-pretty text-muted">{category.description}</p>
            </div>
            <span className="w-fit shrink-0 rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
              {category.status}
            </span>
          </li>
        ))}
      </ul>

      <section aria-labelledby="effacer" className="flex flex-col gap-4">
        <h2 id="effacer" className="font-display text-xl font-semibold">
          Effacer les données de cet appareil
        </h2>
        <p className="max-w-2xl text-pretty text-muted">
          Supprime les cookies de session et tout ce que {siteConfig.name} garde dans ce navigateur.
          Pour supprimer ton compte, rends-toi dans « Mes données », dans la{" "}
          <Link href={routes.library} className="text-foreground underline underline-offset-4">
            Bibliothèque
          </Link>
          .
        </p>
        <ClearDeviceDataButton />
      </section>

      <p className="text-sm text-muted">
        Le détail de chaque cookie figure dans la{" "}
        <Link href={routes.cookies} className="text-foreground underline underline-offset-4">
          politique cookies
        </Link>
        .
      </p>
    </PageContainer>
  );
}
