import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

const DEFAULT_LOCALE = "fr";
const VALID_LOCALES = ["fr", "en", "ar"];

/**
 * Supabase magic-link / OTP callback. Handles both link flows:
 *   - PKCE          → ?code=...                  (exchangeCodeForSession)
 *   - token hash    → ?token_hash=...&type=...    (verifyOtp)
 * then redirects to a locale-prefixed dashboard.
 *
 * `next` carries the locale-prefixed path through the email round-trip and is
 * validated here (open-redirect guard). Failures are logged with the real
 * Supabase error so a "?error=callback" landing is diagnosable.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? `/${DEFAULT_LOCALE}/dashboard`;

  const parts  = next.split("/").filter(Boolean);
  const locale = VALID_LOCALES.includes(parts[0]) ? parts[0] : DEFAULT_LOCALE;
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") && VALID_LOCALES.includes(parts[0])
      ? next
      : `/${locale}/dashboard`;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
    console.error("[auth/callback] verifyOtp failed:", error.message);
  } else {
    console.error("[auth/callback] no `code` or `token_hash` in the callback URL");
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=callback`);
}
