import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Email HTML template ───────────────────────────────────────────────────────
function buildEmailHtml(name: string, slot: string, date: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmation de rendez-vous</title>
</head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a18;padding:32px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <span style="font-size:22px;font-weight:700;color:#f5c842;letter-spacing:-0.5px;">VocazAI</span>
            </div>
            <p style="margin:8px 0 0;color:#888;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;">Assistante vocale intelligente</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;">Confirmation</p>
            <h1 style="margin:0 0 24px;font-size:26px;font-weight:700;color:#1a1a18;line-height:1.2;">
              Votre rendez-vous est confirmé ✓
            </h1>

            <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
              Bonjour <strong style="color:#1a1a18;">${name}</strong>,<br/>
              Votre rendez-vous a été enregistré par Yasmine, votre assistante VocazAI.
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f8f5;border-radius:12px;border:1px solid #e8e6e0;margin-bottom:28px;">
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e8e6e0;">
                        <span style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br/>
                        <span style="font-size:15px;color:#1a1a18;font-weight:600;margin-top:2px;display:block;">${date}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e8e6e0;">
                        <span style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Heure</span><br/>
                        <span style="font-size:15px;color:#1a1a18;font-weight:600;margin-top:2px;display:block;">${slot}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Confirmé par</span><br/>
                        <span style="font-size:15px;color:#f5c842;font-weight:600;margin-top:2px;display:block;">Yasmine — Agent IA VocazAI</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 28px;font-size:14px;color:#777;line-height:1.6;">
              Si vous souhaitez modifier ou annuler ce rendez-vous, contactez-nous directement. Yasmine reste disponible 24h/24.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#f5c842;border-radius:8px;padding:12px 28px;">
                  <a href="https://vocazai.com" style="color:#1a1a18;font-size:14px;font-weight:700;text-decoration:none;">
                    Découvrir VocazAI →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f8f5;border-top:1px solid #e8e6e0;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
              Cet email a été envoyé automatiquement par Yasmine, l'assistante vocale IA de VocazAI.<br/>
              © ${new Date().getFullYear()} VocazAI · <a href="https://vocazai.com" style="color:#aaa;">vocazai.com</a>
            </p>
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
      return NextResponse.json({ error: "name, email and slot required" }, { status: 400 });
    }

    const apptDate = date ?? "Mercredi prochain";

    const { data, error } = await resend.emails.send({
      from:    "Yasmine · VocazAI <onboarding@resend.dev>",
      to:      [email],
      subject: `✓ Rendez-vous confirmé — ${apptDate} à ${slot}`,
      html:    buildEmailHtml(name, slot, apptDate),
    });

    if (error) {
      console.error("[api/email] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[api/email] Sent to", email, "id:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("[api/email]", err);
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }
}
