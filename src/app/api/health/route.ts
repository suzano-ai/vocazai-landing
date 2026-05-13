import { NextResponse } from "next/server";

/**
 * Lightweight health endpoint — used by the GitHub Actions keep-alive cron
 * to prevent Render's free plan from spinning down the service after 15 min
 * of inactivity. No DB, no external calls. Returns immediately.
 *
 * Also useful as Render's `healthCheckPath` and for uptime monitoring tools.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STARTED_AT = new Date().toISOString();

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "vocazai-landing",
    version: process.env.npm_package_version ?? "0.2.0",
    startedAt: STARTED_AT,
    timestamp: new Date().toISOString(),
    region: process.env.RENDER_REGION ?? "unknown",
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
