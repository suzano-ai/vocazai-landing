import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Arch, Khatam, Quatrefoil } from "@/components/zellige";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "À propos — VocazAI",
    en: "About — VocazAI",
    ar: "عن فوكازاي",
  };
  const desc: Record<string, string> = {
    fr: "VocazAI est née à Casablanca pour rendre l'agent vocal IA accessible à toutes les PME francophones et arabophones. Notre mission, notre équipe, nos valeurs.",
    en: "VocazAI was born in Casablanca to make AI voice agents accessible to every French- and Arabic-speaking SMB. Our mission, team and values.",
    ar: "وُلدت فوكازاي في الدار البيضاء لجعل الوكيل الصوتي بالذكاء الاصطناعي في متناول كل الشركات الناطقة بالفرنسية والعربية. مهمتنا وفريقنا وقيمنا.",
  };
  return {
    title: titles[locale] ?? titles.fr,
    description: desc[locale] ?? desc.fr,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        fr: "/fr/about",
        en: "/en/about",
        ar: "/ar/about",
        "x-default": "/fr/about",
      },
    },
    openGraph: {
      title: titles[locale] ?? titles.fr,
      description: desc[locale] ?? desc.fr,
      url: `/${locale}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  const wa = `https://wa.me/33777345056?text=${encodeURIComponent(tc("whatsapp"))}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <Arch
          size={520}
          className="pointer-events-none absolute -right-32 -top-10 text-saffron-500/10"
        />
        <Quatrefoil
          size={280}
          className="pointer-events-none absolute -left-20 top-60 text-teal-500/10"
        />
        <div className="pointer-events-none absolute inset-0 paper" />

        <div className="container relative pb-24 pt-20 lg:pt-28">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
              <span className="font-mono text-kicker uppercase text-muted-foreground">
                {t("kicker")}
              </span>
            </div>
            <h1 className="max-w-4xl font-display text-display-xl font-medium">
              {t("title1")}{" "}
              <span className="italic text-saffron-500">{t("title2")}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
          </Reveal>
        </div>

        <div className="hr-thin" />
      </section>

      {/* MISSION */}
      <section className="border-b border-border bg-surface/40 py-28 sm:py-36">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <div>
                <div className="inline-flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span className="font-mono text-kicker uppercase text-muted-foreground">
                    01 — {t("mission.kicker")}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-display-lg font-medium">
                  {t("mission.title")}
                </h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="space-y-5 text-lg leading-relaxed">
                <p>{t("mission.p1")}</p>
                <p className="text-muted-foreground">{t("mission.p2")}</p>
                <p className="text-muted-foreground">{t("mission.p3")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-28 sm:py-36">
        <div className="container">
          <Reveal>
            <div className="mb-16 max-w-2xl">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                <span className="font-mono text-kicker uppercase text-muted-foreground">
                  02 — {t("values.kicker")}
                </span>
              </div>
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("values.title")}
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-lg bg-border md:grid-cols-3">
            {(["v1", "v2", "v3"] as const).map((key, idx) => (
              <Reveal key={key} delay={idx * 100}>
                <div className="h-full bg-elevated p-8 lg:p-10">
                  <span className="font-mono text-xs text-muted-foreground">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-8 font-display text-2xl font-medium">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`values.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM / STORY */}
      <section className="border-y border-border bg-surface/40 py-28 sm:py-36">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="font-mono text-kicker uppercase text-muted-foreground">
                  03 — {t("story.kicker")}
                </span>
              </div>
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("story.title")}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <p>{t("story.p3")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative overflow-hidden bg-ink-900 py-28 text-saffron-50">
        <Khatam
          size={520}
          className="pointer-events-none absolute -right-32 -top-20 text-saffron-500/15"
        />
        <Arch
          size={400}
          className="pointer-events-none absolute -bottom-20 -left-24 text-teal-500/15"
        />
        <div className="container relative grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="font-mono text-kicker uppercase text-saffron-400">
                04 — {t("contact.kicker")}
              </span>
              <h2 className="mt-6 font-display text-display-lg font-medium">
                {t("contact.title")}
              </h2>
              <p className="mt-6 max-w-md text-lg text-saffron-50/70">
                {t("contact.body")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-6 text-saffron-50/80">
              <ContactRow icon={<MapPin className="h-5 w-5" />} label="Casablanca, Maroc" />
              <ContactRow icon={<Mail className="h-5 w-5" />} label="hello@vocazai.com" />
              <ContactRow icon={<Phone className="h-5 w-5" />} label="+33 7 77 34 50 56" />
              <Link
                href={wa}
                className="group mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-saffron-500 px-7 py-4 text-sm font-medium text-ink-900 transition-all duration-220 ease-soft hover:bg-saffron-400 hover:gap-3"
              >
                {t("contact.cta")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}

function ContactRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-saffron-500/30">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}
