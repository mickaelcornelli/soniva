import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { LibraryGate } from "@/features/auth/components/library-gate";

export const metadata: Metadata = {
  title: "Bibliothèque",
  // Page personnelle : rien à indexer.
  robots: { index: false },
};

export default function LibraryPage() {
  return (
    <PageContainer>
      <PageHeader title="Bibliothèque" />
      <LibraryGate />
    </PageContainer>
  );
}
