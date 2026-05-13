import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("landing.footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-ink-900 font-display font-extrabold italic text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
                V
              </span>
              <div className="font-display text-base font-semibold">VocazAI</div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <FooterCol title={tNav("product")}>
            <FooterLink href={`/${locale}#how`}>{tNav("how")}</FooterLink>
            <FooterLink href={`/${locale}/use-cases`}>{tNav("useCases")}</FooterLink>
            <FooterLink href={`/${locale}/pricing`}>{tNav("pricing")}</FooterLink>
            <FooterLink href={`/${locale}#faq`}>{tNav("faq")}</FooterLink>
          </FooterCol>

          <FooterCol title={tNav("company")}>
            <FooterLink href={`/${locale}/about`}>{tNav("about")}</FooterLink>
            <FooterLink href="mailto:hello@vocazai.com">{tNav("contact")}</FooterLink>
            <FooterLink href={`/${locale}/login`}>{tNav("signIn")}</FooterLink>
          </FooterCol>

          <FooterCol title={tNav("legal")}>
            <FooterLink href={`/${locale}/legal/terms`}>{tNav("terms")}</FooterLink>
            <FooterLink href={`/${locale}/legal/privacy`}>{tNav("privacy")}</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>
            {t("made")} · © {new Date().getFullYear()} VocazAI · {t("rights")}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/fr" className="transition-colors duration-180 hover:text-foreground">FR</Link>
            <Link href="/en" className="transition-colors duration-180 hover:text-foreground">EN</Link>
            <Link href="/ar" className="transition-colors duration-180 hover:text-foreground">ع</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 font-mono text-kicker uppercase text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="transition-colors duration-180 hover:text-saffron-600"
      >
        {children}
      </Link>
    </li>
  );
}
