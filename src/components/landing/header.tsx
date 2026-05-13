"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitch } from "@/components/landing/locale-switch";
import { ArrowUpRight } from "lucide-react";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-220 ease-soft ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink-900 font-display text-base font-extrabold italic text-saffron-500 transition-colors duration-220 dark:bg-saffron-500 dark:text-ink-900">
            V
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            VocazAI
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link
            href={`/${locale}/use-cases`}
            className="text-muted-foreground transition-colors duration-180 hover:text-foreground"
          >
            {tNav("useCases")}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="text-muted-foreground transition-colors duration-180 hover:text-foreground"
          >
            {tNav("pricing")}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="text-muted-foreground transition-colors duration-180 hover:text-foreground"
          >
            {tNav("about")}
          </Link>
          <Link
            href={`/${locale}#faq`}
            className="text-muted-foreground transition-colors duration-180 hover:text-foreground"
          >
            {tNav("faq")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch currentLocale={locale} />
          <ThemeToggle />
          <Link
            href={`/${locale}/login`}
            className="hidden h-9 cursor-pointer items-center rounded-full border border-border bg-elevated px-4 text-sm font-medium transition-colors duration-220 ease-soft hover:border-saffron-500 sm:inline-flex"
          >
            {t("signIn")}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-ink-900 px-4 text-sm font-medium text-saffron-50 transition-colors duration-220 ease-soft hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
          >
            {t("signUp")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
