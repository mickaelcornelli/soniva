import { describe, expect, it } from "vitest";
import { footerNavigation, isNavItemActive } from "./navigation";

describe("footerNavigation", () => {
  it("ne contient que des chemins internes, sans doublon", () => {
    const hrefs = footerNavigation.flatMap((column) => column.links.map((link) => link.href));

    expect(hrefs.every((href) => href.startsWith("/"))).toBe(true);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

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
