"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitch } from "@/components/landing/locale-switch";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 font-display text-lg font-bold text-sand-50 transition group-hover:rotate-3">
            V
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-saffron-500 ring-2 ring-background" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">VocazAI</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition hover:text-foreground">Comment ça marche</a>
          <a href="#uses" className="transition hover:text-foreground">Cas d&apos;usage</a>
          <a href="#pricing" className="transition hover:text-foreground">Tarifs</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch currentLocale={locale} />
          <ThemeToggle />
          <Link
            href={`/${locale}/login`}
            className="hidden rounded-full border border-border px-4 py-1.5 text-sm font-medium transition hover:bg-surface sm:inline-flex"
          >
            {t("signIn")}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-sand-50 transition hover:bg-emerald-700"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>
    </header>
  );
}
