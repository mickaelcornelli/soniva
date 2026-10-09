import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "@/components/layout/editorial-page";
import { Notice } from "@/components/ui/notice";
import { siteConfig } from "@/config/site";
import { SAMPLE_REVIEWS, type SampleReview } from "@/content/reviews";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Avis",
    description: `Exemples d'avis sur ${siteConfig.name}, projet portfolio : ces avis sont fictifs.`,
    path: routes.reviews,
  }),
  // Fictional reviews must never appear in search results.
  robots: { index: false, follow: true },
};

export default function ReviewsPage() {
  return (
    <EditorialPage
      title="Avis"
      description="Ce que pourraient dire celles et ceux qui écoutent Soniva."
      notice={
        <Notice title="Avis fictifs — démonstration">
          {siteConfig.name} est un projet portfolio. Les avis ci-dessous ont été rédigés pour
          illustrer la page : ils ne proviennent pas de vrais utilisateurs.
        </Notice>
      }
    >
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_REVIEWS.map((review) => (
          <li key={review.id} className="flex">
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
      <p className="text-muted">
        Tu utilises Soniva et tu veux donner ton avis ? Écris-nous depuis la page{" "}
        <Link href={routes.contact}>Contact</Link>.
      </p>
    </EditorialPage>
  );
}

function ReviewCard({ review }: { review: SampleReview }) {
  return (
    <figure className="flex w-full flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      <span className="w-fit rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-muted">
        Exemple
      </span>
      <blockquote className="flex-1 text-pretty">« {review.quote} »</blockquote>
      <figcaption className="flex items-center gap-3">
        {/* Initial instead of a photo: no face should suggest a real person. */}
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-raised font-display text-sm font-semibold"
        >
          {review.author.charAt(0).toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-foreground">{review.author}</span>
          <span className="truncate text-sm text-muted">{review.context}</span>
        </span>
      </figcaption>
    </figure>
  );
}
