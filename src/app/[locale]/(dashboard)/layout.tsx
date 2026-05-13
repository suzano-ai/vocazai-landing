import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LayoutDashboard, Phone, Megaphone, Settings, ContactRound, Bot, Hash, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Soft guard: if Supabase isn't configured yet, redirect to login (middleware also handles this)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect(`/${locale}/login`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const t = await getTranslations("dashboard.nav");

  const nav = [
    { href: `/${locale}/dashboard`, label: t("overview"), icon: LayoutDashboard },
    { href: `/${locale}/dashboard/agents`, label: t("agents"), icon: Bot },
    { href: `/${locale}/dashboard/calls`, label: t("calls"), icon: Phone },
    { href: `/${locale}/dashboard/campaigns`, label: t("campaigns"), icon: Megaphone },
    { href: `/${locale}/dashboard/contacts`, label: t("contacts"), icon: ContactRound },
    { href: `/${locale}/dashboard/phone-numbers`, label: t("phoneNumbers"), icon: Hash },
    { href: `/${locale}/dashboard/settings`, label: t("settings"), icon: Settings },
  ];

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-background">
      <aside className="flex flex-col border-r border-border bg-surface">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 font-display font-bold text-sand-50">
            V
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-saffron-500 ring-2 ring-surface" />
          </span>
          <span className="font-display text-lg font-semibold">VocazAI</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-elevated hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="rounded-xl border border-border bg-elevated p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{user.email}</div>
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
      <main className="overflow-y-auto">{children}</main>
    </div>
  );
}
