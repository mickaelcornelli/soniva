/** Clé de mois au format « AAAA-MM », dans le fuseau de l'utilisateur. */
export function toMonthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

function parseMonthKey(key: string): [year: number, month: number] {
  const [year = Number.NaN, month = Number.NaN] = key.split("-").map(Number);
  return [year, month];
}

export function previousMonthKey(key: string): string {
  const [year, month] = parseMonthKey(key);
  return toMonthKey(new Date(year, month - 2, 1));
}

/** Premier jour du mois, au format attendu par la base (`date`). */
export function monthStartDate(key: string): string {
  return `${key}-01`;
}

const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

/** « octobre 2026 ». */
export function formatMonth(key: string): string {
  const [year, month] = parseMonthKey(key);
  return monthFormatter.format(new Date(year, month - 1, 1));
}
