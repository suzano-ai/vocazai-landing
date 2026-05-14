import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "./dashboard-shell";

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

  return (
    <DashboardShell locale={locale} userEmail={user.email ?? ""}>
      {children}
    </DashboardShell>
  );
}
