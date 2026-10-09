import { describe, expect, it } from "vitest";
import { hasStoredSession } from "./browser-client";

describe("hasStoredSession", () => {
  it("détecte le cookie de session, entier ou découpé", () => {
    expect(hasStoredSession("theme=dark; sb-abc-auth-token=xyz")).toBe(true);
    expect(hasStoredSession("sb-abc-auth-token.0=part1; sb-abc-auth-token.1=part2")).toBe(true);
  });

  it("ignore les autres cookies, dont celui d'une connexion abandonnée", () => {
    expect(hasStoredSession("")).toBe(false);
    expect(hasStoredSession("sb-abc-auth-token-code-verifier=v")).toBe(false);
    expect(hasStoredSession("autre=1")).toBe(false);
  });
});
