"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitch } from "@/components/landing/locale-switch";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Header({ locale }: { locale: string }) {
  const t      = useTranslations("common");
  const tNav   = useTranslations("nav");
  const path   = usePathname();

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // close when user scrolls away
  useEffect(() => {
    if (!mobileOpen) return;
    const onScroll = () => { if (window.scrollY > 80) setMobileOpen(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { href: `/${locale}/use-cases`, label: tNav("useCases") },
    { href: `/${locale}/pricing`,   label: tNav("pricing")  },
    { href: `/${locale}/blog`,      label: tNav("blog")     },
    { href: `/${locale}/about`,     label: tNav("about")    },
    { href: `/${locale}#faq`,       label: tNav("faq")      },
  ];

  const isActive = (href: string) =>
    href.includes("#") ? false : path === href || path.startsWith(href + "/");

  return (
    <header
      ref={drawerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ease-soft ${
        scrolled
          ? "border-b border-border/60 bg-background/90 shadow-sm shadow-ink-900/5 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          onClick={closeMobile}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-ink-900 font-display text-base font-extrabold italic text-saffron-500 transition-all duration-220 group-hover:scale-105 dark:bg-saffron-500 dark:text-ink-900">
            V
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-background bg-saffron-500 dark:bg-ink-900" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            VocazAI
          </span>
        </Link>

        {/* Desktop pill nav */}
        <nav
          className={`hidden items-center gap-0.5 rounded-full border px-1.5 py-1 text-sm transition-all duration-300 md:flex ${
            scrolled
              ? "border-border/80 bg-surface/80 shadow-sm shadow-ink-900/4 backdrop-blur-sm"
              : "border-border/40 bg-elevated/60"
          }`}
        >
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-1.5 font-medium transition-all duration-180 ${
                  active
                    ? "bg-background text-foreground shadow-sm shadow-ink-900/8"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-saffron-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <LocaleSwitch currentLocale={locale} />
          <ThemeToggle />
          <span className="mx-0.5 hidden h-4 w-px bg-border/80 sm:block" />
          <Link
            href={`/${locale}/login`}
            className="hidden h-8 cursor-pointer items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-all duration-180 hover:bg-elevated hover:text-foreground sm:inline-flex"
          >
            {t("signIn")}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="hidden h-8 cursor-pointer items-center gap-1.5 rounded-full bg-ink-900 pl-4 pr-3.5 text-sm font-medium text-saffron-50 transition-all duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400 sm:inline-flex"
          >
            {t("signUp")}
            <span className="grid h-4 w-4 place-items-center rounded-full bg-saffron-500/25 dark:bg-ink-900/20">
              <ArrowUpRight className="h-2.5 w-2.5" />
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full border transition-all duration-180 md:hidden ${
              mobileOpen
                ? "border-saffron-500/60 bg-saffron-500/10 text-saffron-600"
                : "border-border hover:border-border/80 hover:bg-elevated"
            }`}
          >
            <span
              className="transition-transform duration-220"
              style={{ transform: mobileOpen ? "rotate(90deg)" : "rotate(0)" }}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer — animated height */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-soft md:hidden ${
          mobileOpen ? "max-h-[440px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border/60 bg-background/97 px-3 pb-5 pt-2 backdrop-blur-xl">
          <nav className="mb-3 flex flex-col gap-0.5">
            {navLinks.map(({ href, label }, i) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: mobileOpen ? `${i * 35}ms` : "0ms" }}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-180 ${
                    active
                      ? "bg-saffron-500/8 text-saffron-600 dark:bg-saffron-500/15 dark:text-saffron-400"
                      : "text-muted-foreground hover:bg-elevated hover:text-foreground"
                  }`}
                >
                  {label}
                  {active
                    ? <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                    : <span className="text-border">›</span>
                  }
                </Link>
              );
            })}
          </nav>
          <div className="flex gap-2 border-t border-border/50 pt-3.5">
            <Link
              href={`/${locale}/login`}
              onClick={closeMobile}
              className="flex-1 rounded-full border border-border/80 py-2.5 text-center text-sm font-medium text-muted-foreground transition-all duration-180 hover:border-saffron-500/60 hover:text-foreground"
            >
              {t("signIn")}
            </Link>
            <Link
              href={`/${locale}/login`}
              onClick={closeMobile}
              className="flex-1 rounded-full bg-ink-900 py-2.5 text-center text-sm font-medium text-saffron-50 transition-all duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
            >
              {t("signUp")} →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
