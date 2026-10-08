"use client";

import { useState } from "react";
import { useAuth } from "../auth-provider";
import { AUTH_PROVIDERS, type AuthProviderId } from "../lib/providers";

interface SignInButtonsProps {
  /** Page où revenir après la connexion. */
  next?: string;
}

export function SignInButtons({ next }: SignInButtonsProps) {
  const { signIn } = useAuth();
  const [pending, setPending] = useState<AuthProviderId | null>(null);
  const [failed, setFailed] = useState(false);

  async function handleSignIn(provider: AuthProviderId) {
    setPending(provider);
    setFailed(false);
    try {
      // En cas de succès, le navigateur part chez le fournisseur : pas de retour ici.
      await signIn(provider, next);
    } catch (error) {
      console.error("[auth] connexion impossible", error);
      setFailed(true);
      setPending(null);
    }
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      {AUTH_PROVIDERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => void handleSignIn(id)}
          disabled={pending !== null}
          className="rounded-full border border-line bg-surface px-5 py-3 font-medium transition-colors hover:border-accent disabled:opacity-60"
        >
          {pending === id ? "Redirection…" : `Continuer avec ${label}`}
        </button>
      ))}
      {failed ? (
        <p role="alert" className="text-center text-sm text-accent">
          La connexion n&apos;a pas pu démarrer. Réessaie dans un instant.
        </p>
      ) : null}
    </div>
  );
}
