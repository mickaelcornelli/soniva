import { describe, expect, it } from "vitest";
import { listenedBetween } from "./listening-meter";

describe("listenedBetween", () => {
  it("compte la progression normale de la lecture", () => {
    expect(listenedBetween(10, 10.25)).toBeCloseTo(0.25);
  });

  it("ignore les sauts en avant et les retours en arrière", () => {
    expect(listenedBetween(10, 95)).toBe(0);
    expect(listenedBetween(95, 10)).toBe(0);
    expect(listenedBetween(10, 10)).toBe(0);
  });
});
