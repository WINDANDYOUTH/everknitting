"use client";

import React from "react";
import { trackQuotationRequest } from "@/components/analytics";

interface ServiceCTAProps {
  serviceKeyword: string;
  serviceSlug: string;
}

/**
 * ServiceCTA Component
 * 
 * A client component for the service page CTA section that includes
 * GA4 tracking for quote requests.
 */
export function ServiceCTA({ serviceKeyword, serviceSlug }: ServiceCTAProps) {
  const handleClick = () => {
    trackQuotationRequest({
      source: `service_page_${serviceSlug}`,
      productType: serviceKeyword.toLowerCase(),
    });
  };

  return (
    <section className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-lg mb-6 text-blue-100">
        Contact us today for a consultation about your {serviceKeyword.toLowerCase()}{" "}
        project.
      </p>
      <a
        href="/contact-us"
        onClick={handleClick}
        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
      >
        Request a Quote
      </a>
    </section>
  );
}
