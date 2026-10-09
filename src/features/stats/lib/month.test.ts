import { describe, expect, it } from "vitest";
import { formatMonth, monthStartDate, previousMonthKey, toMonthKey } from "./month";

describe("mois", () => {
  it("donne la clé du mois local", () => {
    expect(toMonthKey(new Date(2026, 0, 31, 23, 59))).toBe("2026-01");
  });

  it("recule d'un mois, y compris en janvier", () => {
    expect(previousMonthKey("2026-10")).toBe("2026-09");
    expect(previousMonthKey("2026-01")).toBe("2025-12");
  });

  it("formate le mois pour la base et pour l'affichage", () => {
    expect(monthStartDate("2026-10")).toBe("2026-10-01");
    expect(formatMonth("2026-10")).toBe("octobre 2026");
  });
});
