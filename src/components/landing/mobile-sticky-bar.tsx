import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * Mobile-only sticky bottom CTA. Always-visible click-to-call + WhatsApp
 * trial deep-link, keeping the conversion offer in thumb-reach across the
 * whole funnel — not just the landing hero. Mounted on every page that
 * gets organic search traffic; desktop (md+) keeps the inline page CTAs.
 *
 * The trailing 16-unit spacer reserves layout room so the bar doesn't
 * overlap the footer's bottom row on short viewports. Both halves of the
 * bar carry `data-vocazai-track` so click events attribute to the right
 * page surface in the existing analytics layer.
 */
export async function MobileStickyBar({ wa }: { wa: string }) {
  const t = await getTranslations();
  const label = t("landing.finalCta.cta");

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <a
          href="tel:+33777345056"
          className="bracket-cta justify-center text-[11px]"
          aria-label="Call VocazAI"
          data-vocazai-track="mobile_sticky_call"
        >
          CALL
        </a>
        <Link
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="bracket-cta w-full justify-center text-[11px]"
          aria-label={label}
          data-vocazai-track="mobile_sticky_wa"
        >
          {label}
        </Link>
      </div>
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
