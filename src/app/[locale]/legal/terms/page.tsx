import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Conditions Générales d'Utilisation — VocazAI",
    en: "Terms of Service — VocazAI",
    ar: "شروط الاستخدام — فوكازاي",
  };
  return {
    title: titles[locale] ?? titles.fr,
    description: "Conditions générales d'utilisation du service VocazAI.",
    alternates: {
      canonical: `/${locale}/legal/terms`,
      languages: {
        fr: "/fr/legal/terms",
        en: "/en/legal/terms",
        ar: "/ar/legal/terms",
        "x-default": "/fr/legal/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header locale={locale} />
      <main className="container max-w-3xl py-16 lg:py-24">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-saffron-500 mb-3">Légal</p>
          <h1 className="font-display text-4xl font-bold">Conditions Générales d&apos;Utilisation</h1>
          <p className="mt-3 text-muted-foreground">Dernière mise à jour : 14 mai 2026</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground">

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">1. Parties</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les présentes conditions générales d&apos;utilisation (« CGU ») régissent l&apos;accès et l&apos;utilisation de la plateforme VocazAI,
              exploitée par <strong>Mare Nostrum SARL</strong> (ci-après « VocazAI », « nous »). En accédant au service, vous acceptez
              les présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">2. Description du service</h2>
            <p className="text-muted-foreground leading-relaxed">
              VocazAI est une plateforme SaaS permettant aux entreprises de déployer des agents vocaux basés sur l&apos;intelligence
              artificielle. Ces agents peuvent répondre aux appels entrants, prendre des rendez-vous, gérer des FAQ et effectuer
              des appels sortants. Le service est disponible 24h/24, 7j/7, sous réserve des maintenances programmées.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">3. Accès et compte</h2>
            <p className="text-muted-foreground leading-relaxed">
              L&apos;accès au service requiert la création d&apos;un compte via une adresse email professionnelle. Vous êtes responsable
              de la confidentialité de vos identifiants et de toutes les activités effectuées depuis votre compte. VocazAI utilise
              un système d&apos;authentification par lien magique (magic link), sans mot de passe.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">4. Utilisation autorisée</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Vous vous engagez à utiliser le service uniquement à des fins légales et conformément aux présentes CGU. Il est notamment interdit :</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>D&apos;utiliser les agents vocaux à des fins de spam, d&apos;arnaque ou de harcèlement</li>
              <li>De collecter des données personnelles sans consentement explicite des appelants</li>
              <li>D&apos;usurper l&apos;identité d&apos;une personne physique ou morale</li>
              <li>De tenter de contourner les limitations techniques ou contractuelles du service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">5. Tarification et paiement</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les tarifs sont affichés en dollars américains (USD), hors taxes, sur la page <Link href={`/${locale}/pricing`} className="text-saffron-600 hover:underline">Tarifs</Link>.
              La facturation est mensuelle. En cas de dépassement du volume de minutes inclus, la minute supplémentaire est facturée
              à 0,08 USD. Le défaut de paiement entraîne la suspension du service après 7 jours de grâce.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">6. Données et confidentialité</h2>
            <p className="text-muted-foreground leading-relaxed">
              VocazAI stocke les transcriptions et enregistrements d&apos;appels de manière chiffrée, avec isolation par client via
              Row Level Security (RLS PostgreSQL). Les données ne sont jamais revendues à des tiers. Vous conservez la propriété
              de vos données et pouvez les exporter ou les supprimer à tout moment depuis votre tableau de bord.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">7. Disponibilité et SLA</h2>
            <p className="text-muted-foreground leading-relaxed">
              VocazAI s&apos;engage à maintenir une disponibilité de 99,5% pour les plans Starter et Croissance, et 99,9% pour les
              plans Entreprise. En cas d&apos;indisponibilité supérieure à ce seuil, un avoir proportionnel sera crédité sur la
              prochaine facture.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">8. Limitation de responsabilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              VocazAI ne peut être tenu responsable des dommages indirects résultant de l&apos;utilisation ou de l&apos;impossibilité
              d&apos;utiliser le service. La responsabilité totale de VocazAI est limitée au montant des abonnements payés au cours
              des 3 derniers mois précédant l&apos;incident.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">9. Résiliation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vous pouvez résilier votre abonnement à tout moment depuis les paramètres de votre compte. La résiliation prend
              effet à la fin de la période de facturation en cours. VocazAI peut suspendre ou résilier un compte en cas de
              violation des présentes CGU, après mise en demeure restée sans réponse sous 48 heures.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">10. Droit applicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les présentes CGU sont régies par le droit applicable au siège social de Mare Nostrum SARL. Les parties
              s&apos;efforceront de résoudre tout litige à l&apos;amiable avant toute action contentieuse.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question relative aux présentes CGU :{" "}
              <a href="mailto:legal@vocazai.com" className="text-saffron-600 hover:underline">legal@vocazai.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
