import { describe, expect, it } from "vitest";
import { pickArtworkUrl } from "./artwork";

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
