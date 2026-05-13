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
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-elevated/60 backdrop-blur transition hover:bg-elevated ${className}`}
    >
      {!mounted ? (
        <span className="block h-4 w-4 rounded-full bg-muted-foreground/20" />
      ) : isDark ? (
        <Sun className="h-4 w-4 text-saffron-500" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-600" />
      )}
    </button>
  );
}
