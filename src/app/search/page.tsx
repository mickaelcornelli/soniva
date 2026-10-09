import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { SearchView } from "@/features/search/components/search-view";
import { loadOptional } from "@/lib/load-optional";
import { routes } from "@/lib/routes";
import { isSearchable, normalizeSearchQuery } from "@/lib/search";
import { musicProvider } from "@/services/music";
import type { SearchResults } from "@/types/music";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = normalizeSearchQuery((await searchParams).q);
  return {
    title: query ? `Recherche : ${query}` : "Rechercher",
    description: "Recherche des morceaux, des artistes et des playlists sur Soniva.",
    alternates: { canonical: routes.search },
    // Result pages are duplicate content: only the empty search page is indexed.
    robots: query ? { index: false, follow: true } : undefined,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = normalizeSearchQuery((await searchParams).q);
  // Shared link or reload: results arrive server-rendered; on failure the client search takes over.
  const initialResults = isSearchable(query)
    ? await loadOptional<SearchResults | null>(
        () => musicProvider.search(query),
        null,
        "page recherche",
      )
    : null;

  return (
    <PageContainer>
      <PageHeader title="Rechercher" />
      <SearchView initialQuery={query} initialResults={initialResults} />
    </PageContainer>
  );
}
