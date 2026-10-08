import { describe, expect, it } from "vitest";
import { findGenreByName, findGenreBySlug, GENRES, genreLabel, relatedGenres } from "./genres";

describe("catalogue des genres", () => {
  it("a des slugs et des noms uniques, compatibles avec une URL", () => {
    const slugs = GENRES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(GENRES.map((g) => g.name)).size).toBe(GENRES.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});

describe("recherche de genre", () => {
  it("retrouve un genre par slug ou par nom du provider", () => {
    expect(findGenreBySlug("rnb-soul")?.name).toBe("R&B/Soul");
    expect(findGenreByName("hip-hop/rap")?.slug).toBe("hip-hop-rap");
    expect(findGenreBySlug("podcasts")).toBeUndefined();
    expect(findGenreByName(null)).toBeUndefined();
  });

  it("traduit le libellé quand il est connu et garde la valeur brute sinon", () => {
    expect(genreLabel("Classical")).toBe("Classique");
    expect(genreLabel("Podcasts")).toBe("Podcasts");
  });

  it("propose des genres voisins de la même famille", () => {
    const house = findGenreBySlug("house");
    if (!house) throw new Error("genre manquant");

    const related = relatedGenres(house, 4);

    expect(related).toHaveLength(4);
    expect(related.every((g) => g.family === "electronic" && g.slug !== "house")).toBe(true);
  });
});
