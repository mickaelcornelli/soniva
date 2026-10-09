import type { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

function firstString(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === "string" && value.trim() !== "");
}

/** Google and GitHub name profile fields differently. */
export function toAppUser(user: User): AppUser {
  const meta: Record<string, unknown> = user.user_metadata ?? {};
  return {
    id: user.id,
    name:
      firstString(meta.full_name, meta.name, meta.user_name, user.email?.split("@")[0]) ??
      "Auditeur",
    avatarUrl: firstString(meta.avatar_url, meta.picture) ?? null,
  };
}
