import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./src/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

/**
 * Derive the active locale from the URL path so the root layout can emit
 * `<html lang>` and `dir` at SSR time. Crawlers (Googlebot included) don't
 * always execute JS, so client-side lang mutation is not enough for SEO.
 */
function detectLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  return (routing.locales as readonly string[]).includes(seg) ? seg : routing.defaultLocale;
}

export async function middleware(request: NextRequest) {
  // 1) Refresh Supabase session + protect /dashboard routes
  const authResponse = await updateSession(request);
  if (authResponse.headers.get("location")) return authResponse;

  const locale = detectLocale(request.nextUrl.pathname);

  // 2) Root URL renders a language splash. Skip locale rewrite so the
  //    user can actively choose FR / EN / AR.
  if (request.nextUrl.pathname === "/") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 3) Locale routing for every other content URL. Let intl middleware
  //    handle rewrites/redirects, then merge an x-locale request header
  //    on top so the root layout sees it via headers() at SSR time.
  const intlRes = intlMiddleware(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  const merged = NextResponse.next({ request: { headers: requestHeaders } });

  // Preserve intl's rewrite + cookies + redirects by copying its headers.
  intlRes.headers.forEach((value, key) => merged.headers.set(key, value));
  // If intl returned a redirect, honor it directly.
  if (intlRes.status >= 300 && intlRes.status < 400) return intlRes;
  return merged;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|favicon|.*\\..*).*)",
  ],
};
