// components/seo/JSONLD.tsx
import React from "react";

type FAQ = { q: string; a: string };

interface JSONLDProps {
  faqs?: FAQ[];
}

export default function JSONLD({ faqs }: JSONLDProps) {
  const faqItems = Array.isArray(faqs) ? faqs : [];
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ever Knitting Company Limited",
    "alternateName": "Ever Knitting",
    "url": "https://everknitting.com",
    "logo": "https://everknitting.com/logo.png", // Ensure this exists or update
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "", // Add if available
      "contactType": "customer service",
      "email": "info@everknitting.com",
      "availableLanguage": ["English", "Chinese"]
    },
    "sameAs": [
      // Add social links if available
      "https://www.linkedin.com/company/ever-knitting" 
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ever Knitting",
    "url": "https://everknitting.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://everknitting.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = faqItems.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  } : null;

  const schemas: unknown[] = [organizationSchema, webSiteSchema];
  if (faqSchema) schemas.push(faqSchema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
