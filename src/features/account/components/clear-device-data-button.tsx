"use client";

import { Eraser } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { routes } from "@/lib/routes";
import { wipeDeviceData } from "../lib/wipe-device-data";
import { DANGER_BUTTON, SECONDARY_BUTTON } from "./styles";

export function ClearDeviceDataButton() {
  const { state, signOut } = useAuth();
  const [step, setStep] = useState<"idle" | "confirm" | "working">("idle");
  const signedIn = state.status === "signed-in";

  async function handleClear() {
    setStep("working");
    // Sign out first, otherwise the sync would restore the account library on this device.
    if (signedIn) await signOut().catch(() => undefined);
    wipeDeviceData();
    window.location.assign(routes.home);
  }

  if (step === "idle") {
    return (
      <button type="button" onClick={() => setStep("confirm")} className={SECONDARY_BUTTON}>
        <Eraser aria-hidden="true" className="size-4" />
        Effacer les données de cet appareil
      </button>
    );
  }

  return (
    <div role="group" aria-labelledby="effacer-confirmation" className="flex flex-col gap-3">
      <p id="effacer-confirmation" className="text-sm text-pretty">
        {signedIn
          ? "Tu seras déconnecté, et le lecteur, la bibliothèque et les écoutes gardés dans ce navigateur seront effacés. Ton compte et ses données restent intacts."
          : "Le lecteur, ta bibliothèque et tes écoutes gardés dans ce navigateur seront effacés définitivement."}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleClear()}
          disabled={step === "working"}
          className={DANGER_BUTTON}
        >
          {step === "working" ? "Effacement…" : "Effacer"}
        </button>
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={step === "working"}
          className={SECONDARY_BUTTON}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
