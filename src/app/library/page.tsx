import { Library } from "lucide-react";
import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Bibliothèque",
  // Page personnelle : rien à indexer.
  robots: { index: false },
};

export default function LibraryPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-8 md:py-12">
      <PageHeader title="Bibliothèque" />
      <EmptyState
        icon={Library}
        title="Ta bibliothèque arrive bientôt"
        description="Favoris, playlists et historique d'écoute seront rassemblés ici."
      />
    </div>
  );
}
