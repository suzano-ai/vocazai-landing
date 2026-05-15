import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Politique de Confidentialité — VocazAI",
    en: "Privacy Policy — VocazAI",
    ar: "سياسة الخصوصية — فوكازاي",
  };
  return {
    title: titles[locale] ?? titles.fr,
    description:
      "Comment VocazAI collecte, utilise et protège vos données personnelles.",
    alternates: {
      canonical: `/${locale}/legal/privacy`,
      languages: {
        fr: "/fr/legal/privacy",
        en: "/en/legal/privacy",
        ar: "/ar/legal/privacy",
        "x-default": "/fr/legal/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");

  return (
    <>
      <Header locale={locale} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "VocazAI", url: `/${locale}` },
          { name: tNav("legal"), url: `/${locale}/legal/privacy` },
          { name: tNav("privacy"), url: `/${locale}/legal/privacy` },
        ])}
      />
      <main className="container max-w-3xl py-16 lg:py-24">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-saffron-500 mb-3">Légal</p>
          <h1 className="font-display text-4xl font-bold">Politique de Confidentialité</h1>
          <p className="mt-3 text-muted-foreground">Dernière mise à jour : 14 mai 2026</p>
        </div>

        <div className="space-y-8 text-foreground">

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">1. Qui est responsable du traitement ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Mare Nostrum SARL</strong>, exploitant la marque VocazAI, est le responsable du traitement de vos données
              personnelles au sens de la réglementation applicable en matière de protection des données à caractère personnel.
              Contact : <a href="mailto:privacy@vocazai.com" className="text-saffron-600 hover:underline">privacy@vocazai.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">2. Données collectées</h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="rounded-xl border border-border bg-elevated p-4">
                <p className="font-medium text-foreground mb-1">Données de compte</p>
                <p>Adresse email, nom complet (optionnel), identifiant unique. Base légale : exécution du contrat.</p>
              </div>
              <div className="rounded-xl border border-border bg-elevated p-4">
                <p className="font-medium text-foreground mb-1">Données d&apos;appels</p>
                <p>Enregistrements audio (si activé), transcriptions, numéros appelants/appelés, horodatages, durées. Base légale : intérêt légitime + consentement de l&apos;appelant.</p>
              </div>
              <div className="rounded-xl border border-border bg-elevated p-4">
                <p className="font-medium text-foreground mb-1">Données de facturation</p>
                <p>Gérées par Stripe — VocazAI ne stocke jamais les numéros de carte. Seul l&apos;identifiant client Stripe est conservé.</p>
              </div>
              <div className="rounded-xl border border-border bg-elevated p-4">
                <p className="font-medium text-foreground mb-1">Données techniques</p>
                <p>Logs applicatifs, adresses IP, user-agents. Durée de conservation : 90 jours.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Fourniture du service (agents vocaux, dashboard, API)</li>
              <li>Facturation et gestion des abonnements</li>
              <li>Amélioration des modèles IA (données anonymisées uniquement)</li>
              <li>Sécurité et prévention de la fraude</li>
              <li>Support client</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">4. Partage des données</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Vos données ne sont jamais revendues. Elles peuvent être partagées avec les sous-traitants suivants,
              dans le strict cadre de la fourniture du service :
            </p>
            <div className="rounded-xl border border-border bg-elevated overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Sous-traitant</th>
                    <th className="px-4 py-3 text-left">Finalité</th>
                    <th className="px-4 py-3 text-left">Localisation</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground divide-y divide-border">
                  {[
                    ["Supabase", "Base de données + authentification", "UE (AWS Frankfurt)"],
                    ["Stripe", "Paiement et facturation", "États-Unis / UE"],
                    ["OpenAI", "Modèle de langage (transcripts)", "États-Unis"],
                    ["Vapi / Retell", "Infrastructure d'appels vocaux", "États-Unis"],
                    ["Resend", "Emails transactionnels", "États-Unis"],
                  ].map(([name, purpose, location]) => (
                    <tr key={name}>
                      <td className="px-4 py-3 font-medium text-foreground">{name}</td>
                      <td className="px-4 py-3">{purpose}</td>
                      <td className="px-4 py-3">{location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">5. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Données de compte actif : durée de l&apos;abonnement + 1 an</li>
              <li>Transcriptions et enregistrements : 12 mois (configurable dans les paramètres)</li>
              <li>Données de facturation : 10 ans (obligation légale)</li>
              <li>Logs techniques : 90 jours</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">6. Vos droits</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Conformément à la loi 09-08, vous disposez des droits suivants que vous pouvez exercer en écrivant à{" "}
              <a href="mailto:privacy@vocazai.com" className="text-saffron-600 hover:underline">privacy@vocazai.com</a> :
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Accès", "Rectification", "Effacement", "Portabilité", "Opposition", "Limitation"].map((right) => (
                <div key={right} className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm font-medium text-center">
                  {right}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Réponse sous 30 jours. L&apos;export et la suppression de vos données sont également accessibles directement
              depuis votre tableau de bord.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">7. Sécurité</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). L&apos;isolation par client est assurée
              par Row Level Security (RLS) au niveau base de données. Les accès internes sont journalisés et font l&apos;objet
              d&apos;une revue trimestrielle.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">8. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              VocazAI utilise uniquement les cookies strictement nécessaires au fonctionnement du service (session
              d&apos;authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">9. Contact & réclamations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question : <a href="mailto:privacy@vocazai.com" className="text-saffron-600 hover:underline">privacy@vocazai.com</a>.
              Vous pouvez également adresser une réclamation à la Commission Nationale de contrôle de la protection
              des Données à caractère Personnel (CNDP) : <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-saffron-600 hover:underline">www.cndp.ma</a>
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
