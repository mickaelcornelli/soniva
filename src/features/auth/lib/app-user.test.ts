import type { User } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { toAppUser } from "./app-user";

function makeUser(metadata: Record<string, unknown>, email?: string): User {
  return { id: "u1", user_metadata: metadata, email } as unknown as User;
}

describe("toAppUser", () => {
  it("lit le profil Google", () => {
    expect(toAppUser(makeUser({ full_name: "Mickael C", picture: "https://g/p.jpg" }))).toEqual({
      id: "u1",
      name: "Mickael C",
      avatarUrl: "https://g/p.jpg",
    });
  });

  it("lit le profil GitHub", () => {
    expect(toAppUser(makeUser({ user_name: "mcornelli", avatar_url: "https://gh/a.png" }))).toEqual(
      { id: "u1", name: "mcornelli", avatarUrl: "https://gh/a.png" },
    );
  });

  it("se rabat sur l'e-mail puis sur un nom générique", () => {
    expect(toAppUser(makeUser({}, "jane@exemple.fr")).name).toBe("jane");
    expect(toAppUser(makeUser({ name: "  " }))).toMatchObject({
      name: "Auditeur",
      avatarUrl: null,
    });
  });
});
