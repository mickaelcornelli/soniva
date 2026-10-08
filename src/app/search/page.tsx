import { Search } from "lucide-react";
import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Rechercher",
  description: "Recherche des morceaux, des artistes et des playlists sur Soniva.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-8 md:py-12">
      <PageHeader title="Rechercher" />
      <EmptyState
        icon={Search}
        title="La recherche arrive bientôt"
        description="Tu pourras bientôt trouver ici morceaux, artistes et playlists."
      />
    </div>
  );
}
