"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Switch theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-elevated transition-colors duration-220 ease-soft hover:border-saffron-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/40 ${className}`}
    >
      {!mounted ? (
        <span className="block h-3.5 w-3.5 rounded-full bg-muted-foreground/20" />
      ) : isDark ? (
        <Sun className="h-4 w-4 text-saffron-500 transition-transform duration-220 group-hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 text-teal-500 transition-transform duration-220 group-hover:-rotate-12" />
      )}
    </button>
  );
}
