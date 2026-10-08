import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("garde les chemins internes", () => {
    expect(safeRedirectPath("/library")).toBe("/library");
    expect(safeRedirectPath("/search?q=house")).toBe("/search?q=house");
  });

  it.each([null, "", "https://evil.com", "//evil.com", "/\\evil.com", "library"])(
    "refuse %s",
    (value) => {
      expect(safeRedirectPath(value)).toBe("/");
    },
  );
});
