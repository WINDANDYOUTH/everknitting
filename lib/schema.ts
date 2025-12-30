/**
 * JSON-LD SCHEMA GENERATORS
 * 
 * Functions to generate structured data (schema.org) for SEO.
 * Each schema type matches specific page content and follows Google's guidelines.
 * 
 * Key principles:
 * 1. Schema must match on-page content (Google validates this)
 * 2. Use specific schema types (Service, Product, FAQPage) not generic Thing
 * 3. Include all required properties per Google's documentation
 * 4. Keep data accurate and up-to-date
 */

import type { ServiceData } from "@/app/data/services";
import type { ProductData } from "@/app/data/products";
import { BASE_URL } from "./seo";

/**
 * ORGANIZATION SCHEMA
 * 
 * Used in: Root layout (appears on all pages)
 * Purpose: Establishes Ever Knitting as a legitimate business entity
 * Google feature: Knowledge Graph, brand recognition
 * 
 * @see https://schema.org/Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}#organization`,
    name: "Ever Knitting Company Limited",
    alternateName: "Ever Knitting",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
      width: 250,
      height: 60,
    },
    description:
      "Professional knitwear manufacturer offering OEM and ODM services for fashion brands, wholesalers, and private label clothing companies worldwide.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dongguan City",
      addressRegion: "Guangdong Province",
      addressCountry: "CN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@everknitting.com",
        availableLanguage: ["English", "Chinese"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@everknitting.com",
        availableLanguage: ["English", "Chinese"],
      },
    ],
    sameAs: [
      // Add your actual social media profiles
      "https://www.linkedin.com/company/ever-knitting",
      // "https://www.facebook.com/everknitting",
      // "https://www.instagram.com/everknitting",
    ],
    foundingDate: "2009", // Adjust to actual founding year
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "OEM ODM Knitwear Manufacturing",
        description: "Custom knitwear manufacturing services including design, sampling, and production",
      },
    },
  };
}

/**
 * WEBSITE SCHEMA
 * 
 * Used in: Root layout
 * Purpose: Defines the website and enables search box in SERPs
 * Google feature: Sitelinks search box
 * 
 * @see https://schema.org/WebSite
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}#website`,
    url: BASE_URL,
    name: "Ever Knitting",
    description: "Professional knitwear manufacturer for global fashion brands",
    publisher: {
      "@id": `${BASE_URL}#organization`,
    },
    // Uncomment when you implement search functionality
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: {
    //     "@type": "EntryPoint",
    //     urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    //   },
    //   "query-input": "required name=search_term_string",
    // },
  };
}

/**
 * SERVICE SCHEMA
 * 
 * Used in: /services/[slug] pages
 * Purpose: Describes manufacturing services offered
 * Google feature: Rich snippets for services
 * 
 * Important: Must match the actual service content on the page
 * 
 * @see https://schema.org/Service
 */
export function generateServiceSchema(data: ServiceData, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/services/${slug}#service`,
    name: data.h1,
    description: data.intro,
    provider: {
      "@id": `${BASE_URL}#organization`,
    },
    serviceType: data.keyword,
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BASE_URL}/services/${slug}`,
    },
    ...(data.useCases && {
      audience: data.useCases.map((useCase) => ({
        "@type": "Audience",
        audienceType: useCase,
      })),
    }),
  };
}

/**
 * PRODUCT SCHEMA
 * 
 * Used in: /products/[slug] pages
 * Purpose: Describes knitwear products manufactured
 * Google feature: Product rich results
 * 
 * Note: This is for manufacturing capability pages, not individual retail products
 * If you add e-commerce, use Product schema with offers and pricing
 * 
 * @see https://schema.org/Product
 */
export function generateProductSchema(data: ProductData, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/products/${slug}#product`,
    name: data.h1,
    description: data.intro,
    manufacturer: {
      "@id": `${BASE_URL}#organization`,
    },
    ...(data.specifications && {
      additionalProperty: [
        ...(data.specifications.materials?.map((material) => ({
          "@type": "PropertyValue",
          name: "Material",
          value: material,
        })) || []),
        ...(data.specifications.gauges?.map((gauge) => ({
          "@type": "PropertyValue",
          name: "Gauge",
          value: gauge,
        })) || []),
      ],
    }),
    category: "Knitwear Manufacturing",
    // Add this when you have actual product images
    // image: `${BASE_URL}/images/products/${slug}-hero.jpg`,
  };
}

/**
 * FAQ SCHEMA
 * 
 * Used in: All pages with FAQ sections
 * Purpose: Display FAQs directly in search results
 * Google feature: FAQ rich results (prominent in SERPs)
 * 
 * Critical requirements:
 * - Questions must appear on the page exactly as in schema
 * - Answers must match page content word-for-word
 * - Minimum 2 FAQs recommended
 * 
 * @see https://schema.org/FAQPage
 */
export function generateFAQSchema(faqs: Array<{ q: string; a: string }>, pageUrl: string) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/**
 * BREADCRUMB SCHEMA
 * 
 * Used in: Dynamic pages (optional)
 * Purpose: Display breadcrumb navigation in search results
 * Google feature: Breadcrumb rich results
 * 
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.url}`,
    })),
  };
}
