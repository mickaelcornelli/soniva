import { describe, expect, it } from "vitest";
import { formatLongDate } from "./date";

describe("formatLongDate", () => {
  it("formate une date ISO en français", () => {
    expect(formatLongDate("2026-09-12T00:00:00Z")).toBe("12 septembre 2026");
  });

  it("renvoie null pour une date absente ou invalide", () => {
    expect(formatLongDate(null)).toBeNull();
    expect(formatLongDate("pas une date")).toBeNull();
  });
});
