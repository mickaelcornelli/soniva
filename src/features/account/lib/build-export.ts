import type { AccountData } from "../types";

export const EXPORT_FORMAT = "soniva-export";
export const EXPORT_VERSION = 1;

export interface SonivaExport {
  format: typeof EXPORT_FORMAT;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  notice: string;
  account: AccountData | null;
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

export function exportFileName(now: Date = new Date()): string {
  return `soniva-donnees-${now.toISOString().slice(0, 10)}.json`;
}
