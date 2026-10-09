"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { readDeviceStorage } from "@/lib/device-storage";
import { downloadJson } from "@/lib/download-json";
import { createAccountRepository } from "../api/account-repository";
import { buildExport, exportFileName } from "../lib/build-export";
import { PRIMARY_BUTTON } from "./styles";

export function ExportDataButton() {
  const { state } = useAuth();
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  async function handleExport() {
    setStatus("working");
    try {
      const account =
        state.status === "signed-in" ? await createAccountRepository().exportData() : null;
      const now = new Date();
      downloadJson(exportFileName(now), buildExport({ account, device: readDeviceStorage(), now }));
      setStatus("idle");
    } catch (error) {
      console.error("[compte] export impossible", error);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => void handleExport()}
        disabled={status === "working" || state.status === "loading"}
        className={PRIMARY_BUTTON}
      >
        <Download aria-hidden="true" className="size-4" />
        {status === "working" ? "Préparation…" : "Télécharger mes données"}
      </button>
      {status === "error" ? (
        <p role="alert" className="text-sm text-accent">
          L&apos;export a échoué. Vérifie ta connexion et réessaie.
        </p>
      ) : null}
    </div>
  );
}
