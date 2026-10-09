import { describe, expect, it } from "vitest";
import { readSupabaseConfig } from "./public-env";

describe("readSupabaseConfig", () => {
  it("accepte une URL http(s) et une clé", () => {
    expect(readSupabaseConfig("https://abc.supabase.co", "sb_publishable_x")).toEqual({
      url: "https://abc.supabase.co",
      publishableKey: "sb_publishable_x",
    });
  });

  it("refuse une configuration absente ou invalide", () => {
    expect(readSupabaseConfig(undefined, "cle")).toBeNull();
    expect(readSupabaseConfig("https://abc.supabase.co", "")).toBeNull();
    expect(readSupabaseConfig("pas une url", "cle")).toBeNull();
    expect(readSupabaseConfig("javascript:alert(1)", "cle")).toBeNull();
  });
});
