"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/config/public-env";
import { routes } from "@/lib/routes";
import { getSupabaseBrowserClient, hasStoredSession } from "@/services/supabase/browser-client";
import { type AppUser, toAppUser } from "./lib/app-user";
import type { AuthProviderId } from "./lib/providers";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "signed-out"; user: null }
  | { status: "signed-in"; user: AppUser };

interface AuthContextValue {
  state: AuthState;
  signIn: (provider: AuthProviderId, next?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Session de l'utilisateur côté navigateur. Les pages publiques restent statiques :
 * seul le client sait qui est connecté, et la base protège les données par RLS.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [configured] = useState(isSupabaseConfigured);
  const [state, setState] = useState<AuthState>(
    configured ? { status: "loading", user: null } : { status: "signed-out", user: null },
  );

  useEffect(() => {
    if (!configured) {
      console.warn("[auth] Supabase n'est pas configuré : connexion indisponible.");
      return;
    }
    // Visiteur sans session : Supabase n'est chargé qu'au moment de se connecter.
    if (!hasStoredSession()) {
      setState({ status: "signed-out", user: null });
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    getSupabaseBrowserClient()
      .then((supabase) => {
        if (cancelled) return;
        // Déclenché aussitôt avec la session existante (INITIAL_SESSION), puis à chaque changement.
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setState(
            session
              ? { status: "signed-in", user: toAppUser(session.user) }
              : { status: "signed-out", user: null },
          );
        });
        unsubscribe = () => data.subscription.unsubscribe();
      })
      .catch((error: unknown) => {
        console.error("[auth] chargement de Supabase impossible", error);
        if (!cancelled) setState({ status: "signed-out", user: null });
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [configured]);

  const value: AuthContextValue = {
    state,
    async signIn(provider, next = window.location.pathname) {
      const callback = new URL(routes.authCallback, window.location.origin);
      callback.searchParams.set("next", next);
      const supabase = await getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callback.toString() },
      });
      if (error) throw error;
    },
    async signOut() {
      const supabase = await getSupabaseBrowserClient();
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans <AuthProvider>.");
  return context;
}
