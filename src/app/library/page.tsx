import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { LibraryView } from "@/features/library/components/library-view";

export const metadata: Metadata = {
  title: "Bibliothèque",
  robots: { index: false },
};

export default function LibraryPage() {
  return (
    <PageContainer>
      <PageHeader title="Bibliothèque" />
      <LibraryView />
    </PageContainer>
  );
}
