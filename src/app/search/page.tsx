import { Search } from "lucide-react";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Rechercher",
  description: "Recherche des morceaux, des artistes et des playlists sur Soniva.",
};

export default function SearchPage() {
  return (
    <PageContainer>
      <PageHeader title="Rechercher" />
      <EmptyState
        icon={Search}
        title="La recherche arrive bientôt"
        description="Tu pourras bientôt trouver ici morceaux, artistes et playlists."
      />
    </PageContainer>
  );
}
