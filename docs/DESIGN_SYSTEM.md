# VocazAI — Design System

> Editorial × Voice-AI · Maroc-rooted, MENA-confident. Saved here so every page rebuilds the same way.

## North Star

**Three words to anchor every decision** : *Editorial · Confident · Rooted.*

We refuse: AI purple/pink gradients, neon, glassmorphism overkill, kitschy zellige carpets, emojis as icons, bouncy springs, shadows we can't justify.

## Color tokens

All colors live in `src/app/globals.css` as CSS custom properties (HSL triplets) and are surfaced to Tailwind via `tailwind.config.ts`. They auto-adapt to light / dark mode.

### Light mode

| Token | HSL | Hex | Role |
|---|---|---|---|
| `--bg` | `36 38% 93%` | `#F5EFE6` | Background — warm bone paper |
| `--surface` | `36 32% 88%` | `#EDE3D2` | Surface — sand |
| `--elevated` | `0 0% 100%` | `#FFFFFF` | Card, popover |
| `--fg` | `28 14% 9%` | `#1A1714` | Foreground — deep ink |
| `--muted-fg` | `34 14% 36%` | `#6B6049` | Secondary text |
| `--border` | `34 24% 80%` | `#DDD0B7` | Hairline borders |
| `--saffron-500` | `36 82% 54%` | `#E8A12C` | **Brand primary** |
| `--teal-500` | `181 79% 26%` | `#0E7475` | Accent (cool) |
| `--terracotta-500` | `14 60% 47%` | `#C04F30` | Rare emphasis only |

### Dark mode

| Token | HSL | Role |
|---|---|---|
| `--bg` | `28 12% 6%` | Warm ink background `#0E0D0B` |
| `--surface` | `35 13% 8%` | `#15140F` |
| `--elevated` | `34 14% 10%` | `#1D1B16` |
| `--fg` | `36 38% 93%` | Same bone color promoted to text |
| `--saffron-500` | `36 86% 58%` | Slightly punchier in dark |

### Usage rules

- **Saffron** is the brand. Use for CTAs, headline highlight words (italic), badges marking *Recommandé*, status dots, focus rings.
- **Teal** is the cool counterweight. Use for *secondary* section accents (kicker dots), wayfinding numbers. Never compete with saffron in the same eye scan.
- **Terracotta** is reserved. Use it only for warnings, alerts, or 1-pixel-wide attention moments. Never as a primary fill.
- **Ink-900 → Saffron-50 on hover** is our signature button transition (light mode). In dark mode it's saffron-500 → saffron-400.
- Contrast minimum **4.5:1** for body, **3:1** for large display text. Test with `npm run lighthouse` (TBD).

## Typography

Three families, hierarchy by mood not by weight.

| Family | Variable | Purpose |
|---|---|---|
| **Fraunces** | `var(--font-fraunces)` | Display serif — every headline. Italic on the *highlighted* word for warmth. |
| **Inter** | `var(--font-inter)` | Body text, navigation, UI labels. |
| **Tajawal** | `var(--font-tajawal)` | Arabic — applied automatically when `dir="rtl"`. |
| `ui-monospace` | `font-mono` | Kickers (`01 — PROCESS`), timestamps, tabular figures. |

### Display scale

Defined as Tailwind utilities in `tailwind.config.ts`. Always use `clamp()` so type breathes responsively.

| Class | Range | Use |
|---|---|---|
| `text-display-2xl` | 3.5 → 8rem | Hero only |
| `text-display-xl` | 3 → 6rem | Final CTA, About hero |
| `text-display-lg` | 2.25 → 4rem | Section titles |
| `text-display-md` | 1.75 → 2.75rem | Sub-section, card titles |
| `text-kicker` | 0.75rem | Uppercase kickers, 0.18em tracking |

**Italic on highlight words.** The trick that makes the page feel premium and editorial — see hero (`heroTitle2` is italic + saffron).

## Spacing & rhythm

- Section vertical padding: `py-28 sm:py-36` (default), `py-24 lg:py-32` for hero
- Container max-width: `1440px` with `padding: 1.5rem` mobile, `2-3rem` desktop
- Grid gaps: cards `gap-4`, big sections `gap-12`–`gap-16`
- Stack body paragraphs with `mt-3`, sections with `mt-8` / `mt-10`
- One blank line between major thoughts inside a card

## Radius

- `--radius: 0.5rem` (8px) — applied to cards, buttons via `rounded-lg`
- Pills/CTA: `rounded-full`
- Logo block: `rounded-md` (6px)
- Avoid `rounded-2xl` and above except for elevated demo cards

## Motion

| Token | Value | Use |
|---|---|---|
| `duration-180` | 180ms | Color/text transitions |
| `duration-220` | 220ms | Most hovers, button presses |
| `duration-260` | 260ms | Card transforms |
| `ease-soft` | `cubic-bezier(0.2, 0.6, 0.2, 1)` | Default easing — slow start, snappy finish |

**Rule** : every interactive element MUST have a hover state. Never instant — always transition. Respect `prefers-reduced-motion` (handled in `globals.css`).

## Shapes & ornaments

Decoratives live in `src/components/zellige.tsx`. We use **three** geometric primitives, no more:

1. **Khatam** (8-pointed star) — Moroccan rooted, used at low opacity (`/12`) behind heroes & final CTA
2. **Waveform** — voice-AI signature, animated bars
3. **Arch** (keyhole) — coming, used for sections backdrops

**Anti-shapes** : no blobs, no nebula clouds, no rainbow swirls, no Memphis sprinkles, no hexagonal cyber meshes.

## Component patterns

### Button — primary

```tsx
<Link
  href="/cta"
  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-saffron-50 transition-colors duration-220 ease-soft hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
>
  Demander une démo
  <ArrowUpRight className="h-4 w-4" />
</Link>
```

Defining traits: ink → saffron inversion on hover. `cursor-pointer`. `ArrowUpRight` icon, not `ArrowRight` (signals *external action*).

### Button — secondary

```tsx
<a className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-elevated px-6 py-3.5 text-sm font-medium hover:border-foreground">
```

Outline that darkens on hover — never fills.

### Section kicker

```tsx
<span className="font-mono text-kicker uppercase text-muted-foreground">
  <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
  03 — Pricing
</span>
```

Saffron dot for sections 01 / 03 ; teal dot for 02 / 04. Always preceded by section number + em-dash + label.

### Card — recommended price

Border `border-saffron-500`. Badge `bg-saffron-500 text-ink-900` at top-left, `-top-3`. No shadow.

### Card — default

`bg-elevated border-border rounded-lg`. Hover `border-saffron-500 -translate-y-0.5` over 220ms.

## SEO essentials

- Every page sets `metadata` with locale-specific title, description, OG image
- hreflang via `metadata.alternates.languages`
- Structured data (Organization + Service schema) in root layout
- `app/sitemap.ts` + `app/robots.ts` generated dynamically
- OG image generated at `app/opengraph-image.tsx` using Next.js `ImageResponse`

## Anti-patterns checklist

Before merging any UI change, verify:

- [ ] No emojis as icons (use `lucide-react`)
- [ ] `cursor-pointer` on every clickable element
- [ ] Hover state on every interactive element (150-300ms)
- [ ] Light mode text contrast ≥ 4.5:1
- [ ] Focus-visible ring on all CTAs (`focus-visible:ring-2 ring-saffron-500/50`)
- [ ] Responsive at 375 / 768 / 1024 / 1440
- [ ] No purple/pink AI gradients
- [ ] No bouncy spring animations
- [ ] No box-shadow without semantic purpose
- [ ] Display headlines use Fraunces with italic + saffron on the highlight word

## File map

| File | Role |
|---|---|
| `src/app/globals.css` | CSS variables (light/dark), keyframes, utility classes (paper, marquee, wave) |
| `tailwind.config.ts` | Tokens surfaced as Tailwind classes |
| `src/app/layout.tsx` | Root: html, body, fonts (Inter + Fraunces + Tajawal), ThemeProvider |
| `src/app/[locale]/layout.tsx` | NextIntlClientProvider + LangSetter |
| `src/components/zellige.tsx` | Khatam, Waveform, Arch geometric primitives |
| `src/components/theme-toggle.tsx` | Sun/Moon round button |
| `src/components/landing/header.tsx` | Sticky navbar with scroll-aware backdrop |
| `src/components/landing/locale-switch.tsx` | FR/EN/ع dropdown |

When in doubt, reread this file before opening Figma.
