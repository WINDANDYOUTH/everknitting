"use client";

import React from "react";
import { trackQuotationRequest } from "@/components/analytics";

interface ProductCTAProps {
  productKeyword: string;
  productSlug: string;
}

/**
 * ProductCTA Component
 * 
 * A client component for the product page CTA section that includes
 * GA4 tracking for quote requests.
 */
export function ProductCTA({ productKeyword, productSlug }: ProductCTAProps) {
  const handleClick = () => {
    trackQuotationRequest({
      source: `product_page_${productSlug}`,
      productType: productKeyword.toLowerCase(),
    });
  };

  return (
    <section className="mt-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">
        Need {productKeyword}?
      </h2>
      <p className="text-lg mb-6 text-blue-100">
        Get a custom quote for your project. We&apos;ll respond within 24 hours.
      </p>
      <a
        href="/contact-us"
        onClick={handleClick}
        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
      >
        Get a Quote
      </a>
    </section>
  );
}
