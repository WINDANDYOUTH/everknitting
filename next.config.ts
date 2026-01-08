import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'standalone' output - Cloudflare Pages handles this
  // The @cloudflare/next-on-pages adapter will configure the build
};

export default nextConfig;
