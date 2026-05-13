"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitch } from "@/components/landing/locale-switch";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route navigation
  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-220 ease-soft ${
        scrolled || mobileOpen
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="group flex items-center gap-2.5" onClick={closeMobile}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink-900 font-display text-base font-extrabold italic text-saffron-500 transition-colors duration-220 dark:bg-saffron-500 dark:text-ink-900">
            V
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            VocazAI
          </span>
        </Link>

        {/* Desktop nav */}
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
            className="hidden h-9 cursor-pointer items-center gap-1.5 rounded-full bg-ink-900 px-4 text-sm font-medium text-saffron-50 transition-colors duration-220 ease-soft hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400 sm:inline-flex"
          >
            {t("signUp")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border transition-colors duration-180 hover:border-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="border-t border-border bg-background/95 px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            {[
              { href: `/${locale}/use-cases`, label: tNav("useCases") },
              { href: `/${locale}/pricing`,   label: tNav("pricing")  },
              { href: `/${locale}/about`,     label: tNav("about")    },
              { href: `/${locale}#faq`,       label: tNav("faq")      },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors duration-180 hover:bg-elevated hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-border pt-4">
            <Link
              href={`/${locale}/login`}
              onClick={closeMobile}
              className="flex-1 rounded-full border border-border bg-elevated py-2.5 text-center text-sm font-medium transition-colors duration-220 hover:border-saffron-500"
            >
              {t("signIn")}
            </Link>
            <Link
              href={`/${locale}/login`}
              onClick={closeMobile}
              className="flex-1 rounded-full bg-ink-900 py-2.5 text-center text-sm font-medium text-saffron-50 transition-colors duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
            >
              {t("signUp")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
