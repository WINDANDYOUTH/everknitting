import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Remove 'standalone' output - Cloudflare Pages handles this
  // The @cloudflare/next-on-pages adapter will configure the build
};

export default withNextIntl(nextConfig);
