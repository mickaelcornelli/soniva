/**
 * Formate une durée en secondes au format lecteur : `m:ss` ou `h:mm:ss`.
 * Les valeurs invalides (négatives, NaN, Infinity) renvoient `0:00`.
 */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";

  const seconds = Math.floor(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ss = String(s).padStart(2, "0");

  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** Durée totale lisible pour une playlist : « 42 min » ou « 1 h 05 min ». */
export function formatTotalDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0 min";

  const minutes = Math.round(totalSeconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
}
