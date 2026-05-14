import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LOCALE = "fr";
const VALID_LOCALES = ["fr", "en", "ar"];

/**
 * Supabase magic-link / OTP callback. Exchanges the code for a session, then
 * redirects to a locale-prefixed dashboard.
 *
 * The login page sends `emailRedirectTo` as
 *   {origin}/auth/callback?next=/{locale}/dashboard
 * so the locale survives the email round-trip. `next` is validated here as a
 * safe, internal, locale-prefixed path (open-redirect guard) — earlier this
 * route fell back to a bare "/dashboard", which is not a real route.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? `/${DEFAULT_LOCALE}/dashboard`;

  const parts  = next.split("/").filter(Boolean);
  const locale = VALID_LOCALES.includes(parts[0]) ? parts[0] : DEFAULT_LOCALE;
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") && VALID_LOCALES.includes(parts[0])
      ? next
      : `/${locale}/dashboard`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=callback`);
}
