import { describe, expect, it } from "vitest";
import { buildSquareSrcSet, pickArtworkUrl } from "./artwork";

describe("pickArtworkUrl", () => {
  it("prend la taille demandée si elle existe", () => {
    expect(pickArtworkUrl({ small: "s", large: "l" }, "small")).toBe("s");
  });

  it("se rabat sur la taille la plus proche", () => {
    expect(pickArtworkUrl({ small: "s", large: "l" }, "medium")).toBe("l");
    expect(pickArtworkUrl({ small: "s" }, "large")).toBe("s");
  });

  it("renvoie undefined sans aucune image", () => {
    expect(pickArtworkUrl({}, "large")).toBeUndefined();
  });
});

describe("buildSquareSrcSet", () => {
  it("décrit chaque taille disponible par sa largeur", () => {
    expect(buildSquareSrcSet({ small: "s.jpg", medium: "m.jpg", large: "l.jpg" })).toBe(
      "s.jpg 150w, m.jpg 480w, l.jpg 1000w",
    );
  });

  it("n'en produit pas avec une seule taille", () => {
    expect(buildSquareSrcSet({ large: "l.jpg" })).toBeUndefined();
  });
});
