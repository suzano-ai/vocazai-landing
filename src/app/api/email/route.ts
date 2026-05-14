import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

// Pro sender address. Set RESEND_FROM_EMAIL once a domain is verified in
// Resend (e.g. "Yasmine · VocazAI <noreply@vocazai.com>"); falls back to
// Resend's shared test domain until then.
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Yasmine · VocazAI <onboarding@resend.dev>";

// ── Booking confirmation email ────────────────────────────────────────────────
function buildEmailHtml(name: string, slot: string, date: string, email: string) {
  const year = new Date().getFullYear();
  const ref  = `VCZ-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Confirmation de réservation VocazAI</title>
</head>
<body style="margin:0;padding:0;background:#f2f1ed;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a18;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f1ed;padding:48px 16px;">
  <tr><td align="center">
  <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- ── Top bar ── -->
    <tr>
      <td style="background:#f5c842;padding:6px 0;text-align:center;">
        <span style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1a1a18;">
          Réservation confirmée
        </span>
      </td>
    </tr>

    <!-- ── Header ── -->
    <tr>
      <td style="background:#1a1a18;padding:36px 48px 32px;text-align:left;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size:26px;font-weight:800;color:#f5c842;letter-spacing:-1px;">VocazAI</span>
              <p style="margin:4px 0 0;color:#666;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Agent vocal IA · Yasmine</p>
            </td>
            <td align="right" style="vertical-align:top;">
              <span style="background:#2a2a28;color:#888;font-size:11px;font-family:monospace;padding:6px 12px;border-radius:6px;letter-spacing:1px;">
                Réf: ${ref}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── Body ── -->
    <tr>
      <td style="padding:40px 48px 36px;">

        <p style="margin:0 0 6px;font-size:13px;color:#999;letter-spacing:1px;text-transform:uppercase;">Bonjour,</p>
        <h1 style="margin:0 0 20px;font-size:28px;font-weight:800;line-height:1.2;color:#1a1a18;">
          Votre rendez-vous<br/>est confirmé ✓
        </h1>

        <p style="margin:0 0 32px;font-size:15px;color:#555;line-height:1.7;">
          <strong style="color:#1a1a18;">${name}</strong>, Yasmine a bien enregistré votre demande de réservation.
          Voici le récapitulatif de votre rendez-vous :
        </p>

        <!-- ── Booking card ── -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="border:2px solid #f5c842;border-radius:14px;overflow:hidden;margin-bottom:32px;">
          <tr>
            <td style="background:#fffef5;padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <tr>
                  <td width="50%" style="padding:10px 0;border-bottom:1px solid #eee;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Client</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1a1a18;">${name}</p>
                  </td>
                  <td width="50%" style="padding:10px 0 10px 20px;border-bottom:1px solid #eee;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Email</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#1a1a18;">${email}</p>
                  </td>
                </tr>

                <tr>
                  <td width="50%" style="padding:10px 0;border-bottom:1px solid #eee;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Date</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1a1a18;">${date}</p>
                  </td>
                  <td width="50%" style="padding:10px 0 10px 20px;border-bottom:1px solid #eee;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Heure</p>
                    <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#1a1a18;">${slot}</p>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding:10px 0 0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Pris en charge par</p>
                    <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1a1a18;">
                      🤖 Yasmine — Agent vocal IA VocazAI
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>

        <!-- ── Info note ── -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#f8f7f4;border-radius:10px;border-left:4px solid #f5c842;margin-bottom:32px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
                <strong style="color:#1a1a18;">Ceci est une démonstration</strong> de la puissance de l'IA vocale VocazAI.
                Yasmine a recueilli toutes vos informations par la voix et a généré cette confirmation automatiquement.
              </p>
            </td>
          </tr>
        </table>

        <!-- ── CTA ── -->
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#1a1a18;border-radius:10px;">
              <a href="https://vocazai.com"
                style="display:block;padding:14px 32px;color:#f5c842;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                Déployer Yasmine pour mon business →
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- ── Footer ── -->
    <tr>
      <td style="background:#f8f7f4;border-top:1px solid #ebe9e3;padding:24px 48px;text-align:center;">
        <p style="margin:0 0 8px;font-size:12px;color:#bbb;line-height:1.6;">
          Email généré automatiquement par Yasmine · Agent IA VocazAI<br/>
          Réf. ${ref} · © ${year} VocazAI
        </p>
        <a href="https://vocazai.com" style="font-size:12px;color:#f5c842;text-decoration:none;font-weight:600;">
          vocazai.com
        </a>
      </td>
    </tr>

  </table>
  </td></tr>
  </table>

</body>
</html>`;
}

// ── POST /api/email ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { name, email, slot, date } = await request.json();

    if (!name || !email || !slot) {
      return NextResponse.json({ error: "name, email and slot are required" }, { status: 400 });
    }

    const apptDate = date ?? "Mercredi prochain";

    const { data, error } = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      [email],
      subject: `✓ Réservation confirmée — ${apptDate} à ${slot} | VocazAI`,
      html:    buildEmailHtml(name, slot, apptDate, email),
    });

    if (error) {
      console.error("[api/email] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[api/email] Sent →", email, "ref:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("[api/email]", err);
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }
}
