"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LOCALES = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "ع" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export function LocaleSwitch({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
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
        className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border border-border bg-elevated px-3 text-xs font-medium uppercase tracking-wider transition-colors duration-220 ease-soft hover:border-saffron-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/40"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{current.short}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-elevated shadow-xl rtl:left-0 rtl:right-auto">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchTo(l.code)}
                className={`flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-sm transition-colors duration-180 hover:bg-surface ${
                  l.code === currentLocale ? "text-saffron-600" : ""
                }`}
              >
                <span>{l.label}</span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">{l.short}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
