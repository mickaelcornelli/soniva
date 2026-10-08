import { describe, expect, it } from "vitest";
import { splitLinks } from "./linkify";

describe("splitLinks", () => {
  it("isole les liens du texte", () => {
    expect(splitLinks("Tracklist: https://1001.tl/25kjbflk et merci")).toEqual([
      { type: "text", value: "Tracklist: " },
      { type: "link", value: "https://1001.tl/25kjbflk" },
      { type: "text", value: " et merci" },
    ]);
  });

  it("exclut la ponctuation finale du lien", () => {
    expect(splitLinks("(voir https://exemple.com/a).")).toEqual([
      { type: "text", value: "(voir " },
      { type: "link", value: "https://exemple.com/a" },
      { type: "text", value: ")." },
    ]);
  });

  it("renvoie le texte tel quel sans lien", () => {
    expect(splitLinks("Aucun lien ici")).toEqual([{ type: "text", value: "Aucun lien ici" }]);
  });
});
