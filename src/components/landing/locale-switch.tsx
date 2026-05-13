"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LOCALES = [
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
  { code: "en", label: "English",  short: "EN", flag: "🇺🇸" },
  { code: "ar", label: "العربية",  short: "ع",  flag: "🇲🇦" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export function LocaleSwitch({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(locale: LocaleCode) {
    const parts = pathname.split("/");
    if (LOCALES.some((l) => l.code === parts[1])) {
      parts[1] = locale;
    } else {
      parts.splice(1, 0, locale);
    }
    router.push(parts.join("/") || `/${locale}`);
    setOpen(false);
  }

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/40 ${
          open
            ? "border-saffron-500/50 bg-saffron-500/8 text-saffron-700 dark:text-saffron-400"
            : "border-border bg-elevated hover:border-border/80 hover:bg-surface"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-sm">{current.flag}</span>
        <span className="font-mono uppercase tracking-wider">{current.short}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden
          className={`transition-transform duration-180 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-elevated shadow-lg shadow-ink-900/8 rtl:left-0 rtl:right-auto">
            <div className="p-1">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchTo(l.code)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-180 hover:bg-surface ${
                    l.code === currentLocale
                      ? "bg-saffron-500/8 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-400"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="flex-1 text-left">{l.label}</span>
                  {l.code === currentLocale && (
                    <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
