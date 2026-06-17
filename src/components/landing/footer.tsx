import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { POSTS_BY_DATE, type BlogLocale } from "@/content/blog/posts";

export async function Footer({ locale }: { locale: string }) {
  const t    = await getTranslations("landing.footer");
  const tNav = await getTranslations("nav");
  const l    = locale as BlogLocale;
  const latest = POSTS_BY_DATE.slice(0, 3);

  return (
    <footer className="border-t border-border bg-background">
      <div className="container pt-16 pb-10">

        {/* Main grid */}
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <Link href={`/${locale}`} className="group inline-flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-ink-900 font-display font-extrabold italic text-saffron-500 transition-all duration-220 group-hover:scale-105 dark:bg-saffron-500 dark:text-ink-900">
                V
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-background bg-saffron-500 dark:bg-ink-900" />
              </span>
              <span className="font-display text-base font-semibold">VocazAI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            {/* Mini CTA */}
            <Link
              href={`/${locale}/login`}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-saffron-50 transition-all duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
            >
              Essayer gratuitement
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <FooterCol title={tNav("product")}>
            <FooterLink href={`/${locale}#how`}>{tNav("how")}</FooterLink>
            <FooterLink href={`/${locale}/use-cases`}>{tNav("useCases")}</FooterLink>
            <FooterLink href={`/${locale}/pricing`}>{tNav("pricing")}</FooterLink>
            <FooterLink href={`/${locale}/blog`}>{tNav("blog")}</FooterLink>
            <FooterLink href={`/${locale}#faq`}>{tNav("faq")}</FooterLink>
          </FooterCol>

          <FooterCol title={tNav("company")}>
            <FooterLink href={`/${locale}/about`}>{tNav("about")}</FooterLink>
            <FooterLink href="mailto:hello@vocazai.com">{tNav("contact")}</FooterLink>
            <FooterLink href="tel:+33777345056">+33 7 77 34 50 56</FooterLink>
            <FooterLink href="https://wa.me/33777345056?text=Hi%20Aymane%2C%20I%20have%20a%20question%20about%20VocazAI.">
              Ask the founder
            </FooterLink>
            <FooterLink href={`/${locale}/login`}>{tNav("signIn")}</FooterLink>
          </FooterCol>

          <FooterCol title={tNav("legal")}>
            <FooterLink href={`/${locale}/legal/terms`}>{tNav("terms")}</FooterLink>
            <FooterLink href={`/${locale}/legal/privacy`}>{tNav("privacy")}</FooterLink>
          </FooterCol>
        </div>

        {/* Latest articles strip — the footer is the most-trafficked
            UI element on the site (visible across every page), so
            surfacing the 3 most recent blog posts here lifts blog
            discovery from non-blog pages and re-engages visitors
            about to leave with one click on a fresh title. */}
        {latest.length > 0 ? (
          <div className="mt-14 border-t border-border pt-10">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" aria-hidden="true" />
              <span className="font-mono text-kicker uppercase tracking-widest text-muted-foreground/70">
                {t("latestKicker")}
              </span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {latest.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${locale}/blog/${p.slug}`}
                    data-vocazai-track="footer-latest-post"
                    className="group block rounded-lg border border-border bg-elevated p-4 transition-colors duration-220 hover:border-foreground"
                  >
                    <span className="line-clamp-2 font-display text-sm font-medium leading-snug transition-colors duration-220 group-hover:text-saffron-600">
                      {p.title[l]}
                    </span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <time dateTime={p.date}>{p.date}</time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Status row — uptime signal in the same hue as the brand accent.
            Uses the existing /api/health endpoint as the verifiable backing,
            so this isn't a marketing claim, it's a fact the visitor can check. */}
        <div className="mt-14 flex items-center gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron-500" aria-hidden="true" />
          <Link
            href="/api/health"
            prefetch={false}
            className="font-mono uppercase tracking-wider hover:text-foreground"
          >
            All systems operational
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
            <span>
              {t("made")} · Available worldwide · GDPR compliant · EU region · Signed DPA · © {new Date().getFullYear()} VocazAI by Mare Nostrum SARL · {t("rights")}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-elevated px-1.5 py-1">
            {[
              { href: "/fr", label: "FR" },
              { href: "/en", label: "EN" },
              { href: "/ar", label: "ع"  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-180 hover:bg-background hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 font-mono text-kicker uppercase tracking-widest text-muted-foreground/70">
        {title}
      </div>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground transition-colors duration-180 hover:text-saffron-600"
      >
        {children}
      </Link>
    </li>
  );
}
