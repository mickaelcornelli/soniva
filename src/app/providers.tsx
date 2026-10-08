"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/features/auth/auth-provider";
import { LibrarySync } from "@/features/library/library-sync";

/** Durée pendant laquelle une donnée distante est considérée à jour (pas de nouvel appel). */
const STALE_TIME_MS = 5 * 60 * 1000;

export function Providers({ children }: { children: React.ReactNode }) {
  // Un client par navigateur, créé une seule fois (et jamais partagé entre requêtes serveur).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: STALE_TIME_MS, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LibrarySync />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
