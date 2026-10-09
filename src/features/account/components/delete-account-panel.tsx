"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { routes } from "@/lib/routes";
import { createAccountRepository } from "../api/account-repository";
import { wipeDeviceData } from "../lib/wipe-device-data";
import { DANGER_BUTTON, SECONDARY_BUTTON } from "./styles";

/** Mot à saisir pour confirmer : une suppression ne doit jamais partir d'un clic réflexe. */
const CONFIRMATION_WORD = "SUPPRIMER";

type Step = "idle" | "confirm" | "working" | "error";

/** Suppression du compte en deux temps : annonce, puis confirmation saisie. */
export function DeleteAccountPanel() {
  const { signOut } = useAuth();
  const [step, setStep] = useState<Step>("idle");
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (step === "confirm") inputRef.current?.focus();
  }, [step]);

  async function handleDelete() {
    setStep("working");
    try {
      await createAccountRepository().deleteAccount();
    } catch (error) {
      console.error("[compte] suppression impossible", error);
      setStep("error");
      return;
    }
    // Le compte n'existe plus : la session locale est fermée et l'appareil vidé.
    await signOut().catch(() => undefined);
    wipeDeviceData();
    window.location.assign(routes.home);
  }

  if (step === "idle") {
    return (
      <button type="button" onClick={() => setStep("confirm")} className={SECONDARY_BUTTON}>
        <Trash2 aria-hidden="true" className="size-4" />
        Supprimer mon compte…
      </button>
    );
  }

  const confirmed = typed.trim().toUpperCase() === CONFIRMATION_WORD;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (confirmed) void handleDelete();
      }}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-raised p-4"
    >
      <p className="text-sm text-pretty">
        <strong className="font-semibold">Cette action est définitive.</strong> Tes favoris,
        playlists, artistes suivis, historique et statistiques seront supprimés, ainsi que ton
        compte. Pense à télécharger tes données avant, si tu veux les garder.
      </p>
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium">
          Pour confirmer, tape « {CONFIRMATION_WORD} »
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={step === "working"}
          className="w-full max-w-xs rounded-xl border border-line bg-night px-3 py-2 text-foreground"
        />
      </div>
      {step === "error" ? (
        <p role="alert" className="text-sm text-accent">
          La suppression a échoué. Réessaie dans un instant ; si le problème continue, écris-nous.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={!confirmed || step === "working"} className={DANGER_BUTTON}>
          {step === "working" ? "Suppression…" : "Supprimer définitivement"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("idle");
            setTyped("");
          }}
          disabled={step === "working"}
          className={SECONDARY_BUTTON}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
