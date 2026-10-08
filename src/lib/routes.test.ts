import { describe, expect, it } from "vitest";
import { routes } from "./routes";

describe("routes", () => {
  it("construit les chemins des pages publiques en encodant les segments", () => {
    expect(routes.track("D7KyD")).toBe("/track/D7KyD");
    expect(routes.artist("dj é")).toBe("/artist/dj%20%C3%A9");
    expect(routes.playlist("a/b")).toBe("/playlist/a%2Fb");
    expect(routes.stream("D7KyD")).toBe("/api/stream/D7KyD");
    expect(routes.searchFor("lo fi")).toBe("/search?q=lo%20fi");
    expect(routes.searchApi("a&b")).toBe("/api/search?q=a%26b");
  });
});
