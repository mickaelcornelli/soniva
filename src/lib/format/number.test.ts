import { describe, expect, it } from "vitest";
import { formatCompactNumber } from "./number";

// Intl inserts a narrow no-break space before the unit; normalise it.
const normalize = (value: string) => value.replace(/\s/gu, " ");

describe("formatCompactNumber", () => {
  it.each([
    [0, "0"],
    [950, "950"],
    [12_400, "12,4 k"],
    [3_200_000, "3,2 M"],
  ])("formate %s en %s", (input, expected) => {
    expect(normalize(formatCompactNumber(input))).toBe(expected);
  });

  it("renvoie 0 pour une valeur invalide", () => {
    expect(formatCompactNumber(Number.NaN)).toBe("0");
  });
});
