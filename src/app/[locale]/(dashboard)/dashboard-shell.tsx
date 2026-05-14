"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Phone,
  Megaphone,
  Settings,
  ContactRound,
  Bot,
  Hash,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Dashboard shell — server layout handles the auth guard, this client component
 * handles the responsive chrome: a fixed sidebar on md+, a slide-in drawer on
 * mobile (hamburger + backdrop).
 */
export function DashboardShell({
  locale,
  userEmail,
  children,
}: {
  locale: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboard.nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const root = `/${locale}/dashboard`;
  const nav = [
    { href: root, label: t("overview"), icon: LayoutDashboard },
    { href: `${root}/agents`, label: t("agents"), icon: Bot },
    { href: `${root}/calls`, label: t("calls"), icon: Phone },
    { href: `${root}/campaigns`, label: t("campaigns"), icon: Megaphone },
    { href: `${root}/contacts`, label: t("contacts"), icon: ContactRound },
    { href: `${root}/phone-numbers`, label: t("phoneNumbers"), icon: Hash },
    { href: `${root}/settings`, label: t("settings"), icon: Settings },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== root && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[260px_1fr]">
      {/* Mobile top bar */}
      <div className="flex h-14 items-center gap-2 border-b border-border bg-surface px-3 md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-11 w-11 place-items-center rounded-lg text-foreground transition hover:bg-elevated"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display text-lg font-semibold">VocazAI</span>
      </div>

      {/* Backdrop — mobile only, when drawer open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm md:hidden"
          aria-hidden
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static column on md+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-surface transition-transform duration-220 ease-soft md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2.5 border-b border-border px-6">
          <div className="flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-md bg-ink-900 font-display text-base font-extrabold italic text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
              V
            </span>
            <span className="font-display text-lg font-semibold">VocazAI</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-elevated md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive(item.href)
                  ? "bg-elevated font-medium text-foreground"
                  : "text-muted-foreground hover:bg-elevated hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="rounded-xl border border-border bg-elevated p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{userEmail}</div>
                <div className="text-[10px] text-muted-foreground">Membre</div>
              </div>
              <ThemeToggle />
            </div>
            <form action="/auth/signout" method="post" className="mt-2">
              <button className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground">
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
