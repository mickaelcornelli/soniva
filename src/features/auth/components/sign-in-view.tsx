"use client";

import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { routes } from "@/lib/routes";
import { useAuth } from "../auth-provider";
import { SignInButtons } from "./sign-in-buttons";

interface SignInViewProps {
  next: string;
  failed: boolean;
}

export function SignInView({ next, failed }: SignInViewProps) {
  const { state } = useAuth();

  return (
    <div className="flex flex-col items-center gap-6">
      <LogoMark className="size-14" />
      <div className="flex max-w-md flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">Connexion à Soniva</h1>
        <p className="text-muted">
          Retrouve tes favoris, tes playlists et ton historique sur tous tes appareils. Gratuit,
          sans mot de passe.
        </p>
      </div>

      {failed ? (
        <p role="alert" className="text-sm text-accent">
          La connexion n&apos;a pas abouti. Tu peux réessayer.
        </p>
      ) : null}

      {state.status === "signed-in" ? (
        <p className="text-muted">
          Tu es connecté en tant que{" "}
          <span className="font-medium text-foreground">{state.user.name}</span>.{" "}
          <Link href={next === routes.login ? routes.home : next} className="text-accent underline">
            Continuer
          </Link>
        </p>
      ) : (
        <SignInButtons next={next} />
      )}
    </div>
  );
}
