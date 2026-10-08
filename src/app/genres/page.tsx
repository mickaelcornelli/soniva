import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { GenreGrid } from "@/features/genres/components/genre-grid";
import { GENRE_FAMILIES, GENRES } from "@/lib/genres";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Genres",
  description:
    "Explore la musique par genre sur Soniva : électronique, hip-hop, jazz, lo-fi, house, techno… et leurs morceaux du moment, en écoute gratuite.",
  path: routes.genres,
});

export default function GenresPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Genres"
        description="Choisis un style et découvre ce qui s'écoute en ce moment."
      />
      {GENRE_FAMILIES.map((family) => {
        const headingId = `famille-${family.id}`;
        return (
          <section key={family.id} aria-labelledby={headingId} className="flex flex-col gap-4">
            <h2 id={headingId} className="font-display text-xl font-semibold">
              {family.label}
            </h2>
            <GenreGrid
              genres={GENRES.filter((genre) => genre.family === family.id)}
              labelledBy={headingId}
            />
          </section>
        );
      })}
    </PageContainer>
  );
}
