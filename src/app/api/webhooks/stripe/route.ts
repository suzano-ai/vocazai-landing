import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Maps Stripe product/price IDs to our plan names
// Stripe metadata on the subscription carries: { plan: "starter" | "growth" | "enterprise" }
function extractPlan(sub: Stripe.Subscription): string {
  return (sub.metadata?.plan as string | undefined) ?? "starter";
}

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    console.error("[stripe webhook] Signature check failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const sb = createServiceClient();

  switch (event.type) {

    // ── Subscription created or updated ────────────────────────────────────
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const plan = extractPlan(sub);
      const active = sub.status === "active" || sub.status === "trialing";

      const { data: profile } = await sb
        .from("profiles").select("id").eq("stripe_customer_id", customerId).single();

      if (profile) {
        await sb.from("profiles").update({ plan: active ? plan : "free" }).eq("id", profile.id);
        console.log(`[stripe] ${event.type}: user ${profile.id} → plan ${active ? plan : "free"}`);
      } else {
        // Try via metadata
        const userId = sub.metadata?.supabase_user_id;
        if (userId) {
          await sb.from("profiles").update({ plan: active ? plan : "free", stripe_customer_id: customerId }).eq("id", userId);
        }
      }
      break;
    }

    // ── Subscription cancelled ─────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const { data: profile } = await sb
        .from("profiles").select("id").eq("stripe_customer_id", customerId).single();

      if (profile) {
        await sb.from("profiles").update({ plan: "free" }).eq("id", profile.id);
        console.log(`[stripe] subscription.deleted: user ${profile.id} → free`);
      }
      break;
    }

    // ── Checkout completed ────────────────────────────────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan   = session.metadata?.plan;
      if (userId && plan) {
        await sb.from("profiles").update({ plan }).eq("id", userId);
        console.log(`[stripe] checkout.completed: user ${userId} → ${plan}`);
      }
      break;
    }

    default:
      // Ignore other events
      break;
  }

  return NextResponse.json({ received: true });
}
