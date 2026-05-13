import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // We allow CDN assets for fonts (Google Fonts handled by next/font)
};

export default withNextIntl(nextConfig);
