import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { INQUIRY_ACTION_BODY_SIZE_LIMIT } from './lib/inquiry-attachments';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Remove 'standalone' output - Cloudflare Pages handles this
  // The @cloudflare/next-on-pages adapter will configure the build
  experimental: {
    serverActions: {
      // Base64 + JSON/multipart overhead for 10 MiB of decoded attachments.
      // Next 15.2.9 only enforces this on Node; the action also validates on Edge.
      bodySizeLimit: INQUIRY_ACTION_BODY_SIZE_LIMIT,
    },
  },
};

export default withNextIntl(nextConfig);
