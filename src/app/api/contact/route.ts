import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "VocazAI <contact@vocazai.com>";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "contact@vocazai.com";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
    }

    const data = await request.json();
    const firstName = String(data.first_name ?? "").trim();
    const lastName = String(data.last_name ?? "").trim();
    const email = String(data.email ?? "").trim();

    if (!firstName || !email) {
      return NextResponse.json({ error: "first_name and email are required" }, { status: 400 });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const { data: sent, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `Nouvelle demande de demo - ${fullName}`,
      html: `
        <h2>Nouvelle demande de demo VocazAI</h2>
        <p><strong>Nom :</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Telephone :</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Secteur :</strong> ${escapeHtml(data.industry)}</p>
        <p><strong>Volume d'appels :</strong> ${escapeHtml(data.call_volume)}</p>
        <p><strong>Message :</strong> ${escapeHtml(data.message || "Aucun message")}</p>
      `,
    });

    if (error) {
      console.error("[api/contact] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: sent?.id });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }
}
