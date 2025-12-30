/**
 * SEO UTILITIES
 * 
 * Helper functions for generating SEO metadata across all pages.
 * Follows Next.js App Router metadata conventions.
 */

import type { Metadata } from "next";

interface SeoConfig {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Base URL for canonical URLs and Open Graph
 * Update this to your production domain
 */
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://everknitting.com";

/**
 * Generate metadata for a page
 * @param config - SEO configuration object
 * @returns Next.js Metadata object
 */
export function generateMetadata({
  title,
  description,
  canonical,
  keywords,
  ogImage,
  noindex = false,
}: SeoConfig): Metadata {
  const metadata: Metadata = {
    title,
    description,
    ...(canonical && {
      alternates: {
        canonical: `${BASE_URL}${canonical}`,
      },
    }),
    ...(keywords && {
      keywords: keywords.join(", "),
    }),
    openGraph: {
      title,
      description,
      url: canonical ? `${BASE_URL}${canonical}` : BASE_URL,
      siteName: "Ever Knitting",
      type: "website",
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && {
        images: [ogImage],
      }),
    },
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };

  return metadata;
}

/**
 * Generate metadata for service pages
 * This ensures consistent metadata generation across all service pages
 */
export function generateServiceMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  return generateMetadata({
    title,
    description,
    canonical: `/services/${slug}`,
    ogImage: `${BASE_URL}/og-images/services/${slug}.jpg`, // Generate these images
  });
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  return generateMetadata({
    title,
    description,
    canonical: `/products/${slug}`,
    ogImage: `${BASE_URL}/og-images/products/${slug}.jpg`,
  });
}

/**
 * Generate metadata for industry pages
 */
export function generateIndustryMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  return generateMetadata({
    title,
    description,
    canonical: `/industries/${slug}`,
    ogImage: `${BASE_URL}/og-images/industries/${slug}.jpg`,
  });
}
