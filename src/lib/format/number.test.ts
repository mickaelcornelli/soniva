import { describe, expect, it } from "vitest";
import { formatCompactNumber } from "./number";

// Intl insère une espace insécable fine entre le nombre et l'unité : on normalise.
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
