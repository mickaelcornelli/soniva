"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { type ShareOutcome, shareLink } from "../lib/share-link";

/** Durée d'affichage de la confirmation « lien copié ». */
const FEEDBACK_DURATION_MS = 2_500;

const FEEDBACK: Partial<Record<ShareOutcome, string>> = {
  copied: "Lien copié dans le presse-papiers",
  failed: "Impossible de partager ce lien",
};

interface ShareButtonProps {
  /** Titre proposé au partage (ex. « Night Drive — Lune Rouge »). */
  title: string;
  /** Chemin de la page à partager (ex. `/track/abc`). */
  path: string;
  size?: "sm" | "md";
}

export function ShareButton({ title, path, size = "md" }: ShareButtonProps) {
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);

  useEffect(() => {
    if (!outcome) return;
    const timer = setTimeout(() => setOutcome(null), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [outcome]);

  async function handleClick() {
    // L'origine réelle (et non la configuration) : le lien reste juste en préproduction.
    const url = new URL(path, window.location.origin).toString();
    setOutcome(await shareLink({ title, url }));
  }

  const copied = outcome === "copied";
  const message = outcome ? FEEDBACK[outcome] : undefined;

  return (
    <>
      <IconButton
        icon={copied ? Check : Share2}
        label={copied ? "Lien copié" : `Partager ${title}`}
        active={copied}
        onClick={() => void handleClick()}
        size={size}
      />
      <span role="status" className="sr-only">
        {message}
      </span>
    </>
  );
}
