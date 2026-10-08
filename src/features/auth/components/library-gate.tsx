"use client";

import { Library } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/lib/routes";
import { useAuth } from "../auth-provider";
import { AccountCard } from "./account-card";
import { SignInButtons } from "./sign-in-buttons";

/** Contenu de la bibliothèque selon l'état de connexion. */
export function LibraryGate() {
  const { state } = useAuth();

  if (state.status === "loading") {
    return <Skeleton className="h-20 w-full rounded-2xl" />;
  }

  if (state.status === "signed-out") {
    return (
      <EmptyState
        icon={Library}
        title="Ta bibliothèque t'attend"
        description="Connecte-toi pour garder tes favoris, tes playlists et ton historique sur tous tes appareils."
        action={<SignInButtons next={routes.library} />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AccountCard />
      <EmptyState
        icon={Library}
        title="Ta bibliothèque est prête"
        description="Favoris, playlists et historique d'écoute arrivent dans la prochaine mise à jour."
      />
    </div>
  );
}
