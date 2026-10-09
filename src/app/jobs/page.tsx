import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "@/components/layout/editorial-page";
import { Notice } from "@/components/ui/notice";
import { siteConfig } from "@/config/site";
import { JOB_OFFERS, type JobOffer } from "@/content/jobs";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Offres d'emploi",
    description: `Exemples d'offres d'emploi chez ${siteConfig.name}, projet portfolio : ces offres sont fictives.`,
    path: routes.jobs,
  }),
  // Offres fictives : elles ne doivent pas apparaître dans les moteurs de recherche d'emploi.
  robots: { index: false, follow: true },
};

export default function JobsPage() {
  return (
    <EditorialPage
      title="Offres d'emploi"
      description="Les métiers qui feraient grandir Soniva."
      notice={
        <Notice title="Offres fictives">
          {siteConfig.name} est un projet portfolio et ne recrute pas. Ces fiches de poste
          illustrent la page : aucune candidature n&apos;est reçue ni traitée.
        </Notice>
      }
    >
      <ul className="flex flex-col gap-6">
        {JOB_OFFERS.map((job) => (
          <li key={job.id}>
            <JobCard job={job} />
          </li>
        ))}
      </ul>
      <p className="text-muted">
        Une question sur le projet ? Passe par la page <Link href={routes.contact}>Contact</Link>.
      </p>
    </EditorialPage>
  );
}

function JobCard({ job }: { job: JobOffer }) {
  const headingId = `offre-${job.id}`;
  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <header className="flex flex-col gap-3">
        <h2 id={headingId} className="font-display text-xl font-semibold text-foreground">
          {job.title}
        </h2>
        <ul aria-label="Informations sur le poste" className="flex list-none flex-wrap gap-2 p-0">
          {[job.team, job.location, job.contract].map((info) => (
            <li
              key={info}
              className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
            >
              {info}
            </li>
          ))}
        </ul>
      </header>
      <p>{job.summary}</p>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="flex flex-col gap-2">
          <h3>Tes missions</h3>
          <ul>
            {job.missions.map((mission) => (
              <li key={mission}>{mission}</li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <h3>Ton profil</h3>
          <ul>
            {job.profile.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <p className="text-sm text-muted">Offre de démonstration : candidatures fermées.</p>
    </article>
  );
}
