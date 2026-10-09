import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Pour les artistes",
  description: `Publie ta musique sur Audius et elle devient disponible sur ${siteConfig.name}, gratuitement et sans démarche supplémentaire.`,
  path: routes.forArtists,
});

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "publier",
    title: "Publier ta musique",
    content: (
      <>
        <p>
          {siteConfig.name} diffuse le catalogue d&apos;<a href="https://audius.co">Audius</a>. Pour
          y apparaître, il suffit de publier tes morceaux sur Audius : ton profil, tes titres et tes
          playlists publiques deviennent disponibles sur {siteConfig.name} automatiquement.
        </p>
        <ol>
          <li>Crée ton compte artiste sur Audius.</li>
          <li>Publie tes morceaux avec une pochette, un genre et une description.</li>
          <li>Ta page artiste apparaît sur {siteConfig.name}, prête à être partagée.</li>
        </ol>
      </>
    ),
  },
  {
    id: "visibilite",
    title: "Être découvert",
    content: (
      <ul>
        <li>Tes morceaux peuvent entrer dans les tendances et les pages genre.</li>
        <li>Ils peuvent être recommandés dans « Pour toi » et enchaînés par la radio.</li>
        <li>
          Les personnes qui te suivent voient tes nouveautés dès leur arrivée sur l&apos;accueil.
        </li>
        <li>
          Un genre bien renseigné sur Audius aide {siteConfig.name} à proposer ta musique aux bonnes
          oreilles.
        </li>
      </ul>
    ),
  },
  {
    id: "droits",
    title: "Tes droits",
    content: (
      <>
        <p>
          Ta musique reste la tienne. {siteConfig.name} ne stocke aucun fichier audio, ne prend
          aucune commission et ne revend rien : chaque écoute est diffusée directement par Audius.
        </p>
        <p>
          Pour modifier ou retirer un morceau, fais-le sur Audius : le changement est repris sur{" "}
          {siteConfig.name} automatiquement.
        </p>
      </>
    ),
  },
  {
    id: "partager",
    title: "Partager ta page",
    content: (
      <p>
        Chaque page artiste, morceau et playlist a son propre lien, avec une image d&apos;aperçu
        pour les réseaux sociaux. Un problème avec ta page ? Passe par la page{" "}
        <Link href={routes.contact}>Contact</Link>.
      </p>
    ),
  },
];

export default function ForArtistsPage() {
  return (
    <EditorialPage
      title="Pour les artistes"
      description={`Publie sur Audius, sois écouté sur ${siteConfig.name}.`}
      updatedAt="2026-10-09"
      sections={SECTIONS}
    />
  );
}
