import { describe, expect, it } from "vitest";
import { parseTrendingPeriod, trendingPeriodLabel } from "./trending-period";

describe("parseTrendingPeriod", () => {
  it("accepte les périodes connues", () => {
    expect(parseTrendingPeriod("month")).toBe("month");
    expect(parseTrendingPeriod(["allTime", "week"])).toBe("allTime");
  });

  it("retombe sur la semaine pour une valeur absente ou inconnue", () => {
    expect(parseTrendingPeriod(undefined)).toBe("week");
    expect(parseTrendingPeriod("decade")).toBe("week");
  });
});

describe("trendingPeriodLabel", () => {
  it("donne un libellé lisible", () => {
    expect(trendingPeriodLabel("year")).toBe("Cette année");
  });
});
