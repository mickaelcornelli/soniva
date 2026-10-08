import { describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { toIsoDuration, trackStructuredData } from "./structured-data";

const track = makeTrack({
  id: "D7KyD",
  tags: ["synthwave", "night"],
  releaseDate: "2026-09-12",
  artwork: { large: "https://cdn.example/1000.jpg" },
});

describe("toIsoDuration", () => {
  it.each([
    [214, "PT3M34S"],
    [59.6, "PT1M0S"],
    [-3, "PT0M0S"],
  ])("convertit %s s en %s", (input, expected) => {
    expect(toIsoDuration(input)).toBe(expected);
  });
});

describe("trackStructuredData", () => {
  it("décrit le morceau comme un MusicRecording schema.org", () => {
    expect(trackStructuredData(track)).toMatchObject({
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: "Night Drive",
      duration: "PT3M34S",
      image: "https://cdn.example/1000.jpg",
      keywords: "synthwave, night",
      byArtist: { "@type": "MusicGroup", name: "Lune Rouge" },
    });
  });
});
