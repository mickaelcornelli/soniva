import type { TrendingPeriod } from "@/types/music";

export const DEFAULT_TRENDING_PERIOD: TrendingPeriod = "week";

export const TRENDING_PERIODS: readonly { value: TrendingPeriod; label: string }[] = [
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois-ci" },
  { value: "year", label: "Cette année" },
  { value: "allTime", label: "De tous les temps" },
];

const VALID = new Set<string>(TRENDING_PERIODS.map((p) => p.value));

/** Unknown values fall back to the week. */
export function parseTrendingPeriod(raw: string | string[] | undefined): TrendingPeriod {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && VALID.has(value) ? (value as TrendingPeriod) : DEFAULT_TRENDING_PERIOD;
}

export function trendingPeriodLabel(period: TrendingPeriod): string {
  return TRENDING_PERIODS.find((p) => p.value === period)?.label ?? "";
}
