import { Compass } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <EmptyState
        icon={Compass}
        title="Cette page n'existe pas"
        description="Le lien est peut-être incomplet, ou le contenu a été retiré."
        action={
          <Link
            href="/"
            className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Retour aux tendances
          </Link>
        }
      />
    </div>
  );
}
