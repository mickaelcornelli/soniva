"use client";

import { RotateCw, WifiOff } from "lucide-react";
import { useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <EmptyState
        icon={WifiOff}
        title="Le contenu n'a pas pu être chargé"
        description="Le service musical ne répond pas pour le moment. Vérifie ta connexion puis réessaie."
        action={
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Réessayer
          </button>
        }
      />
    </PageContainer>
  );
}
