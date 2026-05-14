import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

const DEFAULT_LOCALE = "fr";
const VALID_LOCALES = ["fr", "en", "ar"];

/**
 * Public-facing origin. Behind Traefik, `request.url` is the *internal*
 * container address (http://0.0.0.0:PORT) — redirecting to that gives a dead
 * link. Traefik sets X-Forwarded-Host / X-Forwarded-Proto, so prefer those;
 * fall back to the Host header, then to request.url for local dev.
 */
function publicOrigin(request: NextRequest): string {
  const fwdHost = request.headers.get("x-forwarded-host");
  if (fwdHost) {
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${fwdHost}`;
  }
  const host = request.headers.get("host");
  if (host && !host.includes("0.0.0.0") && !host.includes("127.0.0.1")) {
    const proto = request.url.startsWith("https") ? "https" : "http";
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

/**
 * Supabase magic-link / OTP callback. Handles both link flows:
 *   - PKCE          → ?code=...                  (exchangeCodeForSession)
 *   - token hash    → ?token_hash=...&type=...    (verifyOtp)
 * then redirects to a locale-prefixed dashboard on the public origin.
 *
 * `next` carries the locale-prefixed path through the email round-trip and is
 * validated here (open-redirect guard). Failures are logged with the real
 * Supabase error so a "?error=callback" landing is diagnosable.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
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
