import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./src/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1) Refresh Supabase session + protect /dashboard routes
  const authResponse = await updateSession(request);
  if (authResponse.headers.get("location")) return authResponse;

  // 2) Locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|favicon|.*\\..*).*)",
  ],
};
