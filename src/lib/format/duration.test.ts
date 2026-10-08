import { describe, expect, it } from "vitest";
import { formatDuration } from "./duration";

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [65, "1:05"],
    [599.9, "9:59"],
    [3600, "1:00:00"],
    [3725, "1:02:05"],
  ])("formate %s s en %s", (input, expected) => {
    expect(formatDuration(input)).toBe(expected);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("renvoie 0:00 pour %s", (input) => {
    expect(formatDuration(input)).toBe("0:00");
  });
});
