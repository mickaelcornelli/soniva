import { Flag } from "lucide-react";
import type { Metadata } from "next";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { PUBLISHER } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Signaler un contenu",
  description: `Signaler à ${siteConfig.name} un contenu illicite, une atteinte aux droits d'auteur ou une faille de sécurité.`,
  path: routes.report,
});

const REPORT_SUBJECT = "Signalement Soniva";

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "quoi",
    title: "Que signaler ?",
    content: (
      <ul>
        <li>Un morceau, une pochette ou un profil illicite, haineux ou choquant.</li>
        <li>Une œuvre publiée sans l&apos;accord de ses ayants droit.</li>
        <li>Un nom de playlist ou de profil injurieux.</li>
        <li>Une faille de sécurité ou un problème touchant tes données.</li>
      </ul>
    ),
  },
  {
    id: "comment",
    title: "Que mettre dans ton message ?",
    content: (
      <ul>
        <li>Le lien de la page concernée.</li>
        <li>La raison du signalement, aussi précise que possible.</li>
        <li>Pour les droits d&apos;auteur : l&apos;œuvre concernée et ton lien avec elle.</li>
        <li>Une adresse où te répondre.</li>
      </ul>
    ),
  },
  {
    id: "audius",
    title: "Droits d'auteur : prévenir aussi Audius",
    content: (
      <p>
        {siteConfig.name} n&apos;héberge aucun morceau : ils sont publiés et diffusés par{" "}
        <a href="https://audius.co">Audius</a>. Un retrait chez Audius supprime le contenu partout,
        y compris sur {siteConfig.name}. De notre côté, nous transmettons à Audius les signalements
        qui le concernent.
      </p>
    ),
  },
  {
    id: "suite",
    title: "Et ensuite ?",
    content: (
      <p>
        Chaque signalement est lu et reçoit une réponse. Les signalements abusifs ou faits de
        mauvaise foi peuvent engager la responsabilité de leur auteur.
      </p>
    ),
  },
];

export default function ReportPage() {
  return (
    <EditorialPage
      title="Signaler un contenu"
      description="Un contenu te paraît illicite ou porte atteinte à tes droits ? Dis-le nous."
      sections={SECTIONS}
      notice={
        <a
          href={`mailto:${PUBLISHER.email}?subject=${encodeURIComponent(REPORT_SUBJECT)}`}
          className="flex w-fit items-center gap-3 rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Flag aria-hidden="true" className="size-5" />
          Envoyer un signalement
        </a>
      }
    />
  );
}
