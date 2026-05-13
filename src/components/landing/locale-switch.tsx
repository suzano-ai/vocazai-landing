"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";

const LOCALES: { code: string; label: string; nativeLabel: string }[] = [
  { code: "fr", label: "Français", nativeLabel: "FR" },
  { code: "en", label: "English", nativeLabel: "EN" },
  { code: "ar", label: "العربية", nativeLabel: "ع" },
];

export function LocaleSwitch({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(locale: string) {
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
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-elevated/60 px-3 text-sm font-medium backdrop-blur transition hover:bg-elevated"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-display">{current.nativeLabel}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-elevated shadow-2xl">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchTo(l.code)}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-surface ${l.code === currentLocale ? "text-emerald-600" : ""}`}
              >
                <span>{l.label}</span>
                <span className="text-xs text-muted-foreground">{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
