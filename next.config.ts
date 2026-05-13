import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone output bundles only the files needed to run in production.
  // Used by the Docker image — copies .next/standalone + .next/static to the container.
  output: "standalone",
};

export default withNextIntl(nextConfig);
