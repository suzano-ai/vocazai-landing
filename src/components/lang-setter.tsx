"use client";

import { useEffect } from "react";

/**
 * Updates document.documentElement lang/dir to match the active locale.
 * Necessary because <html> lives in the root layout (which doesn't know
 * the locale at build time). Hydration warning is suppressed in root layout.
 */
export function LangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
