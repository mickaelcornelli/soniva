import { Library } from "lucide-react";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Bibliothèque",
  // Page personnelle : rien à indexer.
  robots: { index: false },
};

export default function LibraryPage() {
  return (
    <PageContainer>
      <PageHeader title="Bibliothèque" />
      <EmptyState
        icon={Library}
        title="Ta bibliothèque arrive bientôt"
        description="Favoris, playlists et historique d'écoute seront rassemblés ici."
      />
    </PageContainer>
  );
}
