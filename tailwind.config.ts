import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem", xl: "3rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        elevated: "hsl(var(--elevated) / <alpha-value>)",
        foreground: "hsl(var(--fg) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-fg) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--saffron-500) / <alpha-value>)",

        saffron: {
          50:  "hsl(var(--saffron-50) / <alpha-value>)",
          200: "hsl(var(--saffron-200) / <alpha-value>)",
          400: "hsl(var(--saffron-400) / <alpha-value>)",
          500: "hsl(var(--saffron-500) / <alpha-value>)",
          600: "hsl(var(--saffron-600) / <alpha-value>)",
          700: "hsl(var(--saffron-700) / <alpha-value>)",
        },
        teal: {
          500: "hsl(var(--teal-500) / <alpha-value>)",
          600: "hsl(var(--teal-600) / <alpha-value>)",
          700: "hsl(var(--teal-700) / <alpha-value>)",
        },
        terracotta: {
          500: "hsl(var(--terracotta-500) / <alpha-value>)",
        },
        ink: { 900: "hsl(var(--ink-900) / <alpha-value>)" },

        /* shadcn semantic */
        card: { DEFAULT: "hsl(var(--surface) / <alpha-value>)", foreground: "hsl(var(--fg) / <alpha-value>)" },
        popover: { DEFAULT: "hsl(var(--elevated) / <alpha-value>)", foreground: "hsl(var(--fg) / <alpha-value>)" },
        primary: { DEFAULT: "hsl(var(--saffron-500) / <alpha-value>)", foreground: "hsl(var(--ink-900) / <alpha-value>)" },
        secondary: { DEFAULT: "hsl(var(--surface) / <alpha-value>)", foreground: "hsl(var(--fg) / <alpha-value>)" },
        accent: { DEFAULT: "hsl(var(--teal-500) / <alpha-value>)", foreground: "hsl(var(--bg) / <alpha-value>)" },
        destructive: { DEFAULT: "hsl(0 70% 50% / <alpha-value>)", foreground: "hsl(var(--bg) / <alpha-value>)" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        /* Terminal Console — every family now resolves to mono. Fraunces
           and Inter still ship for back-compat on internal pages but the
           landing/splash compose on monospace exclusively. */
        sans:    ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        display: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        arabic:  ["var(--font-tajawal)", "Tajawal", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Terminal console type scale — mono, tighter tracking, less drama
           than serif display since condensed mono doesn't compress well. */
        "display-2xl": ["clamp(3rem, 8vw, 7.5rem)",   { lineHeight: "0.96", letterSpacing: "-0.05em" }],
        "display-xl":  ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "1.0",  letterSpacing: "-0.045em" }],
        "display-lg":  ["clamp(2rem, 4.5vw, 4rem)",   { lineHeight: "1.05", letterSpacing: "-0.04em" }],
        "display-md":  ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1",  letterSpacing: "-0.03em" }],
        "kicker":      ["0.6875rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.2, 0.6, 0.2, 1)",
      },
      transitionDuration: {
        180: "180ms",
        220: "220ms",
        260: "260ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
