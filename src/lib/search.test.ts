import { describe, expect, it } from "vitest";
import { isSearchable, normalizeSearchQuery } from "./search";

describe("normalizeSearchQuery", () => {
  it("nettoie les espaces et accepte un paramètre répété", () => {
    expect(normalizeSearchQuery("  lo   fi \n")).toBe("lo fi");
    expect(normalizeSearchQuery(["house", "techno"])).toBe("house");
  });

  it("renvoie une chaîne vide pour une valeur absente ou invalide", () => {
    expect(normalizeSearchQuery(undefined)).toBe("");
    expect(normalizeSearchQuery(42)).toBe("");
  });

  it("borne la longueur", () => {
    expect(normalizeSearchQuery("a".repeat(500))).toHaveLength(100);
  });
});

describe("isSearchable", () => {
  it("exige au moins deux caractères", () => {
    expect(isSearchable("a")).toBe(false);
    expect(isSearchable("ab")).toBe(true);
  });
});
