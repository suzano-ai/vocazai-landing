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
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set("Content-Language", locale);
    res.headers.set("Vary", "Accept-Language");
    return res;
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

  // Protocol-level language signal — some crawlers prefer Content-Language
  // over the <html lang> attribute. Vary tells caches/CDNs the response
  // differs by Accept-Language so they key on locale correctly.
  merged.headers.set("Content-Language", locale);
  merged.headers.set("Vary", "Accept-Language");

  // RFC 8288 hreflang Link headers — every locale variant of the current
  // path advertised as alternate. Crawlers that parse the Link header
  // before fetching the HTML get the hreflang map instantly, same as the
  // <link rel="alternate" hreflang> tags Next emits via metadata.alternates.
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";
  const pathWithoutLocale = request.nextUrl.pathname.replace(
    new RegExp(`^/(${(routing.locales as readonly string[]).join("|")})(?=/|$)`),
    "",
  );
  const hreflangLinks = (routing.locales as readonly string[])
    .map((l) => `<${base}/${l}${pathWithoutLocale}>; rel="alternate"; hreflang="${l}"`)
    .concat(`<${base}/fr${pathWithoutLocale}>; rel="alternate"; hreflang="x-default"`)
    .join(", ");
  const existingLink = merged.headers.get("Link");
  merged.headers.set("Link", existingLink ? `${existingLink}, ${hreflangLinks}` : hreflangLinks);

  // If intl returned a redirect, honor it directly.
  if (intlRes.status >= 300 && intlRes.status < 400) return intlRes;
  return merged;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|favicon|.*\\..*).*)",
  ],
};
