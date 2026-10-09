import type { AccountData } from "../types";

export const EXPORT_FORMAT = "soniva-export";
export const EXPORT_VERSION = 1;

export interface SonivaExport {
  format: typeof EXPORT_FORMAT;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  /** Explique le contenu à la personne qui ouvre le fichier. */
  notice: string;
  /** Données du compte ; null pour un visiteur sans compte. */
  account: AccountData | null;
  /** Stockage local du navigateur (lecteur, bibliothèque, écoutes). */
  device: Record<string, unknown>;
}

const NOTICE =
  "Export des données personnelles de Soniva. Les morceaux et artistes sont désignés par leur identifiant Audius : leurs informations détaillées restent chez Audius.";

export function buildExport({
  account,
  device,
  now = new Date(),
}: {
  account: AccountData | null;
  device: Record<string, unknown>;
  now?: Date;
}): SonivaExport {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    notice: NOTICE,
    account,
    device,
  };
}

/** « soniva-donnees-2026-10-09.json » */
export function exportFileName(now: Date = new Date()): string {
  return `soniva-donnees-${now.toISOString().slice(0, 10)}.json`;
}
