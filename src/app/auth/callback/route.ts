import { NextResponse } from "next/server";
import { routes } from "@/lib/routes";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { createSupabaseServerClient } from "@/services/supabase/server-client";

/** OAuth return: exchanges the code for a session, sets the cookies and redirects back. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
    console.error("[auth] échange du code impossible", error);
  }

  return NextResponse.redirect(new URL(`${routes.login}?erreur=1`, origin));
}
