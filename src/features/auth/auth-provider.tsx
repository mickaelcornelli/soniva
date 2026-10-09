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

/** Public pages stay static: only the client knows who is signed in, and RLS protects the data. */
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
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    // No stored session: don't load Supabase until the user signs in. Both
    // branches go through a promise so state only changes inside a callback.
    const client = hasStoredSession() ? getSupabaseBrowserClient() : Promise.resolve(null);
    client
      .then((supabase) => {
        if (cancelled) return;
        if (!supabase) {
          setState({ status: "signed-out", user: null });
          return;
        }
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
