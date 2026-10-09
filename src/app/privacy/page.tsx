import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { DataTable } from "@/components/ui/data-table";
import { siteConfig } from "@/config/site";
import { CNIL, DATA_HOST, LEGAL_UPDATED_AT, PUBLISHER, THIRD_PARTIES } from "@/content/legal";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Politique de confidentialité",
  description: `Quelles données ${siteConfig.name} utilise, pourquoi, combien de temps, avec qui, et comment exercer tes droits.`,
  path: routes.privacy,
});

const PURPOSES = [
  [
    "Écouter sans compte",
    "Bibliothèque, écoutes et file de lecture, gardées dans ton navigateur",
    "Service demandé (stockage strictement nécessaire)",
    "Jusqu'à ce que tu les effaces",
  ],
  [
    "Créer un compte et te connecter",
    "Identifiant, e-mail, nom et avatar transmis par Google ou GitHub",
    "Exécution des conditions d'utilisation",
    "Tant que le compte existe",
  ],
  [
    "Synchroniser ta bibliothèque",
    "Favoris, playlists, artistes suivis (identifiants Audius et dates)",
    "Exécution des conditions d'utilisation",
    "Tant que le compte existe",
  ],
  [
    "Historique et « Ton mois en musique »",
    "Morceaux écoutés, dates, temps d'écoute par mois, genre",
    "Exécution des conditions d'utilisation",
    "200 dernières écoutes ; statistiques mensuelles tant que le compte existe",
  ],
  [
    "Faire fonctionner et sécuriser le site",
    "Adresse IP et données techniques de connexion",
    "Intérêt légitime (sécurité, prévention des abus)",
    "Journaux techniques de courte durée chez les hébergeurs",
  ],
  [
    "Répondre à tes messages",
    "Adresse e-mail et contenu du message",
    "Intérêt légitime (répondre à ta demande)",
    "Le temps de traiter la demande, puis un an au plus",
  ],
] as const;

const SECTIONS: readonly EditorialSection[] = [
  {
    id: "essentiel",
    title: "L'essentiel",
    content: (
      <ul>
        <li>Pas de publicité, pas de mesure d&apos;audience, pas de traceur tiers.</li>
        <li>Aucune donnée vendue ni utilisée pour du profilage publicitaire.</li>
        <li>
          Les recommandations « Pour toi » sont calculées dans ton navigateur, pas sur un serveur.
        </li>
        <li>Un compte est facultatif : sans compte, tout reste sur ton appareil.</li>
        <li>
          Tu peux exporter ou supprimer tes données toi-même, depuis « Mes données » dans la{" "}
          <Link href={routes.library}>Bibliothèque</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "responsable",
    title: "Responsable du traitement",
    content: (
      <p>
        {PUBLISHER.name}, éditeur de {siteConfig.name} ({PUBLISHER.status.toLowerCase()}). Contact
        pour toute question sur tes données :{" "}
        <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
      </p>
    ),
  },
  {
    id: "finalites",
    title: "Données, finalités et durées",
    content: (
      <>
        <p>
          {siteConfig.name} ne stocke que des identifiants de morceaux et d&apos;artistes Audius :
          titres, pochettes et profils restent chez Audius.
        </p>
        <DataTable
          caption="Données traitées par finalité, avec leur base légale et leur durée de conservation"
          columns={["Finalité", "Données", "Base légale", "Durée"]}
          rows={PURPOSES}
        />
      </>
    ),
  },
  {
    id: "destinataires",
    title: "Destinataires et transferts hors UE",
    content: (
      <>
        <p>
          Les données des comptes sont stockées à {DATA_HOST.dataLocation}. Certains prestataires
          sont établis hors de l&apos;Union européenne : les transferts sont alors encadrés par les
          garanties indiquées ci-dessous.
        </p>
        <DataTable
          caption="Services qui reçoivent des données, avec leur rôle, leur localisation et les garanties de transfert"
          columns={["Service", "Rôle", "Données", "Localisation", "Garantie"]}
          rows={THIRD_PARTIES.map((party) => [
            <a key="lien" href={party.policyUrl}>
              {party.name}
            </a>,
            party.role,
            party.data,
            party.location,
            party.safeguard,
          ])}
        />
      </>
    ),
  },
  {
    id: "securite",
    title: "Sécurité",
    content: (
      <ul>
        <li>Connexions chiffrées (HTTPS) sur tout le site.</li>
        <li>
          Aucun mot de passe géré par {siteConfig.name} : la connexion passe par Google ou GitHub.
        </li>
        <li>
          Règles d&apos;accès au niveau de la base de données : chaque compte ne peut lire et
          modifier que ses propres données.
        </li>
        <li>Les clés d&apos;accès au service musical restent côté serveur.</li>
      </ul>
    ),
  },
  {
    id: "droits",
    title: "Tes droits",
    content: (
      <>
        <p>
          Tu disposes des droits d&apos;accès, de rectification, d&apos;effacement, de limitation,
          d&apos;opposition et de portabilité, ainsi que du droit de définir des directives sur le
          sort de tes données après ton décès.
        </p>
        <ul>
          <li>
            <strong>Accès et portabilité</strong> : « Exporter mes données » dans la Bibliothèque
            télécharge un fichier JSON complet.
          </li>
          <li>
            <strong>Effacement</strong> : « Supprimer mon compte » efface immédiatement le compte et
            toutes ses données ; « Effacer les données de cet appareil » vide le navigateur.
          </li>
          <li>
            <strong>Autres demandes</strong> : écris à{" "}
            <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>. Une réponse t&apos;est
            apportée dans un délai d&apos;un mois.
          </li>
        </ul>
        <p>
          Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la{" "}
          {CNIL.name}, {CNIL.address}, ou en ligne sur <a href={CNIL.url}>cnil.fr</a>.
        </p>
      </>
    ),
  },
  {
    id: "mineurs",
    title: "Mineurs",
    content: (
      <p>
        L&apos;écoute sans compte est ouverte à tous. La création d&apos;un compte est réservée aux
        personnes de 15 ans et plus ; en dessous, elle nécessite l&apos;accord d&apos;un parent.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies et stockage local",
    content: (
      <p>
        {siteConfig.name} n&apos;utilise que des cookies et un stockage local strictement
        nécessaires, détaillés dans la <Link href={routes.cookies}>politique cookies</Link>. Aucun
        consentement n&apos;est donc demandé.
      </p>
    ),
  },
  {
    id: "modifications",
    title: "Modifications",
    content: (
      <p>
        Cette politique peut évoluer avec le service. La date de mise à jour figure en haut de page
        ; en cas de changement important, une information sera affichée sur le site.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <EditorialPage
      title="Politique de confidentialité"
      description="Ce que Soniva fait de tes données, et surtout ce qu'il n'en fait pas."
      updatedAt={LEGAL_UPDATED_AT}
      sections={SECTIONS}
    />
  );
}
