import { Compass } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <PageContainer>
      <EmptyState
        icon={Compass}
        headingLevel={1}
        title="Cette page n'existe pas"
        description="Le lien est peut-être incomplet, ou le contenu a été retiré."
        action={
          <Link
            href={routes.home}
            className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Retour aux tendances
          </Link>
        }
      />
    </PageContainer>
  );
}
