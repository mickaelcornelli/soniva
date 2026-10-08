import { describe, expect, it } from "vitest";
import { pluralize } from "./plural";

// Intl sépare les milliers par une espace insécable fine : on normalise.
const normalize = (value: string) => value.replace(/\s/gu, " ");

describe("pluralize", () => {
  it.each([
    [0, "0 morceau"],
    [1, "1 morceau"],
    [2, "2 morceaux"],
    [1200, "1 200 morceaux"],
  ])("accorde %s", (count, expected) => {
    expect(normalize(pluralize(count, "morceau", "morceaux"))).toBe(expected);
  });

  it("ajoute un s par défaut", () => {
    expect(pluralize(3, "abonné")).toBe("3 abonnés");
  });
});
