import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        // Semantic tokens (driven by CSS vars — auto light/dark)
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
        ring: "hsl(var(--emerald-500) / <alpha-value>)",

        // Brand — Moroccan palette (same names both modes; intensity adapts via tokens)
        emerald: {
          50: "hsl(var(--emerald-50) / <alpha-value>)",
          100: "hsl(var(--emerald-100) / <alpha-value>)",
          500: "hsl(var(--emerald-500) / <alpha-value>)",
          600: "hsl(var(--emerald-600) / <alpha-value>)",
          700: "hsl(var(--emerald-700) / <alpha-value>)",
          900: "hsl(var(--emerald-900) / <alpha-value>)",
        },
        saffron: {
          50: "hsl(var(--saffron-50) / <alpha-value>)",
          400: "hsl(var(--saffron-400) / <alpha-value>)",
          500: "hsl(var(--saffron-500) / <alpha-value>)",
          600: "hsl(var(--saffron-600) / <alpha-value>)",
        },
        terracotta: {
          500: "hsl(var(--terracotta-500) / <alpha-value>)",
          700: "hsl(var(--terracotta-700) / <alpha-value>)",
        },
        sand: {
          50: "hsl(var(--sand-50) / <alpha-value>)",
          100: "hsl(var(--sand-100) / <alpha-value>)",
          200: "hsl(var(--sand-200) / <alpha-value>)",
        },

        // Shadcn compatibility
        card: { DEFAULT: "hsl(var(--surface) / <alpha-value>)", foreground: "hsl(var(--fg) / <alpha-value>)" },
        popover: { DEFAULT: "hsl(var(--elevated) / <alpha-value>)", foreground: "hsl(var(--fg) / <alpha-value>)" },
        primary: { DEFAULT: "hsl(var(--emerald-600) / <alpha-value>)", foreground: "hsl(var(--sand-50) / <alpha-value>)" },
        secondary: { DEFAULT: "hsl(var(--surface) / <alpha-value>)", foreground: "hsl(var(--fg) / <alpha-value>)" },
        accent: { DEFAULT: "hsl(var(--saffron-500) / <alpha-value>)", foreground: "hsl(var(--emerald-900) / <alpha-value>)" },
        destructive: { DEFAULT: "hsl(0 72% 51% / <alpha-value>)", foreground: "hsl(var(--sand-50) / <alpha-value>)" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        arabic: ["var(--font-noto-arabic)", "Noto Sans Arabic", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "pulse-ring": { "0%": { transform: "scale(1)", opacity: "0.5" }, "100%": { transform: "scale(2.6)", opacity: "0" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 32s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
