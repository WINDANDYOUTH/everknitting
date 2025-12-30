/**
 * REUSABLE SEO SCHEMA COMPONENT
 * 
 * Purpose: Inject JSON-LD structured data into pages
 * Usage: Import and add to any page that needs schema markup
 * 
 * Why component approach:
 * - Type safety with TypeScript
 * - Reusable across all pages
 * - Easy to maintain and update
 * - Automatic JSON formatting
 * 
 * Google reads JSON-LD from anywhere in the page, but best practice
 * is to include it in the <head> (Next.js handles this automatically)
 */

import React from "react";
import type { ServiceData } from "@/app/data/services";
import type { ProductData } from "@/app/data/products";
import type { IndustryData } from "@/app/data/industries";
import {
  generateServiceSchema,
  generateProductSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

type SchemaType = "Service" | "Product" | "Industry" | "FAQ" | "Breadcrumb";

interface SeoSchemaProps {
  type: SchemaType;
  data?: ServiceData | ProductData | IndustryData;
  slug?: string;
  faqs?: Array<{ q: string; a: string }>;
  pageUrl?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * SeoSchema Component
 * 
 * Generates and injects JSON-LD structured data based on type and data provided.
 * 
 * @example Service page
 * ```tsx
 * <SeoSchema type="Service" data={serviceData} slug="knitwear-manufacturer" />
 * ```
 * 
 * @example Product page
 * ```tsx
 * <SeoSchema type="Product" data={productData} slug="cashmere-sweaters" />
 * ```
 * 
 * @example FAQ only
 * ```tsx
 * <SeoSchema 
 *   type="FAQ" 
 *   faqs={data.faq} 
 *   pageUrl="/services/knitwear-manufacturer" 
 * />
 * ```
 */
export function SeoSchema({ type, data, slug, faqs, pageUrl, breadcrumbs }: SeoSchemaProps) {
  let schema: object | object[] | null = null;

  switch (type) {
    case "Service":
      if (data && slug) {
        schema = generateServiceSchema(data as ServiceData, slug);
      }
      break;

    case "Product":
      if (data && slug) {
        schema = generateProductSchema(data as ProductData, slug);
      }
      break;

    case "Industry":
      // Industries use Service schema since they describe services for specific industries
      if (data && slug) {
        const industryData = data as IndustryData;
        schema = {
          "@context": "https://schema.org",
          "@type": "Service",
          name: industryData.h1,
          description: industryData.intro,
        };
      }
      break;

    case "FAQ":
      if (faqs && pageUrl) {
        schema = generateFAQSchema(faqs, pageUrl);
      }
      break;

    case "Breadcrumb":
      if (breadcrumbs) {
        schema = generateBreadcrumbSchema(breadcrumbs);
      }
      break;

    default:
      console.warn(`Unknown schema type: ${type}`);
      return null;
  }

  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * COMBINED SCHEMA COMPONENT
 * 
 * For pages that need multiple schemas (e.g., Service + FAQ)
 * Google supports multiple JSON-LD blocks or array format
 * 
 * @example
 * ```tsx
 * <CombinedSchema schemas={[serviceSchema, faqSchema]} />
 * ```
 */
interface CombinedSchemaProps {
  schemas: (object | null)[];
}

export function CombinedSchema({ schemas }: CombinedSchemaProps) {
  const validSchemas = schemas.filter((s) => s !== null);

  if (validSchemas.length === 0) {
    return null;
  }

  // Google supports @graph for multiple schemas in one block
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": validSchemas,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 2),
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * USAGE GUIDELINES
 * 
 * 1. Page-specific schemas (Service, Product, FAQ) go in page.tsx
 *    Example: app/services/[slug]/page.tsx
 * 
 * 2. Site-wide schemas (Organization, Website) go in layout.tsx
 *    Example: app/layout.tsx
 * 
 * 3. Always validate with Google's Rich Results Test:
 *    https://search.google.com/test/rich-results
 * 
 * 4. Match schema data to page content exactly:
 *    - FAQ questions/answers must appear on page
 *    - Service names must match H1
 *    - Descriptions must match intro text
 * 
 * 5. Don't use schema for content not on the page (Google may penalize)
 */
