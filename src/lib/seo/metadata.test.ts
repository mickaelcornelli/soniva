import { describe, expect, it } from "vitest";
import { buildPageMetadata, truncateDescription } from "./metadata";

describe("truncateDescription", () => {
  it("met le texte sur une ligne et le coupe proprement", () => {
    expect(truncateDescription("Une\n  ligne   propre")).toBe("Une ligne propre");
    expect(truncateDescription("abcdef ghij", 8)).toBe("abcdef…");
  });
});

describe("buildPageMetadata", () => {
  it("renseigne canonique, Open Graph et carte Twitter avec image", () => {
    const metadata = buildPageMetadata({
      title: "Night Drive",
      description: "Un morceau.",
      path: "/track/D7KyD",
      image: "https://cdn.example/1000.jpg",
    });

    expect(metadata.alternates?.canonical).toBe("/track/D7KyD");
    expect(metadata.openGraph).toMatchObject({
      url: "/track/D7KyD",
      images: [{ url: "https://cdn.example/1000.jpg", alt: "Night Drive" }],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("utilise une carte simple sans image", () => {
    const metadata = buildPageMetadata({ title: "T", description: "D", path: "/" });

    expect(metadata.twitter).toMatchObject({ card: "summary" });
  });
});
