import { describe, expect, it } from "vitest";
import { isNavItemActive } from "./navigation";

describe("isNavItemActive", () => {
  it("n'active l'accueil que sur la racine", () => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/", "/search")).toBe(false);
  });

  it("active une section sur ses sous-pages, pas sur un simple préfixe", () => {
    expect(isNavItemActive("/library", "/library")).toBe(true);
    expect(isNavItemActive("/library", "/library/favoris")).toBe(true);
    expect(isNavItemActive("/library", "/library-old")).toBe(false);
  });
});
