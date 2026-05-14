import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Refreshes the Supabase session cookie on every request.
 * Called from middleware.ts at the project root.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // If env vars are not set yet, skip auth entirely (allows the landing to render
  // even before Supabase is configured on the deployment).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /{locale}/dashboard/* routes
  const pathname = request.nextUrl.pathname;
  const dash = pathname.match(/^\/(fr|en|ar)\/dashboard/);
  if (dash && !user) {
    const locale = dash[1];
    // Public origin — behind Traefik the internal request is 0.0.0.0:PORT,
    // so a redirect built from nextUrl would point at a dead address.
    const fwdHost = request.headers.get("x-forwarded-host");
    const origin = fwdHost
      ? `${request.headers.get("x-forwarded-proto") ?? "https"}://${fwdHost}`
      : request.nextUrl.origin;
    const redirectUrl = new URL(`/${locale}/login`, origin);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
