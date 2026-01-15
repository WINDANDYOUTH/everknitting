/**
 * Analytics Event Tracking Utilities
 * 
 * These functions push events to the GTM dataLayer.
 * GTM will forward these to GA4 and any other configured platforms.
 * 
 * Usage:
 * import { trackQuotationRequest } from "@/components/analytics";
 * 
 * trackQuotationRequest({ productType: "cashmere sweater", source: "hero_cta" });
 */

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Generic event tracking function
 * Pushes custom events to GTM dataLayer
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });
  
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Event: ${eventName}`, eventParams);
  }
}

/**
 * Track quotation/quote request events
 * 
 * Call this when user clicks "Request a Quote" buttons or submits quote forms
 * 
 * @param params - Event parameters
 * @param params.source - Where the request originated (e.g., "hero_cta", "service_page", "contact_form")
 * @param params.productType - Type of product being quoted (optional)
 * @param params.pageUrl - Current page URL (auto-captured if not provided)
 */
export function trackQuotationRequest(params: {
  source: string;
  productType?: string;
  pageUrl?: string;
}) {
  trackEvent("request_quotation", {
    event_category: "Lead Generation",
    event_label: params.source,
    product_type: params.productType,
    page_url: params.pageUrl || (typeof window !== "undefined" ? window.location.href : ""),
  });
}

/**
 * Track form submissions
 * 
 * @param params - Event parameters
 * @param params.formName - Name/identifier of the form
 * @param params.formLocation - Where the form is located on the site
 */
export function trackFormSubmission(params: {
  formName: string;
  formLocation: string;
}) {
  trackEvent("form_submission", {
    event_category: "Engagement",
    form_name: params.formName,
    form_location: params.formLocation,
  });
}

/**
 * Track CTA button clicks
 * 
 * @param params - Event parameters
 * @param params.ctaText - Text on the button
 * @param params.ctaLocation - Where the CTA appears
 * @param params.destination - Where the CTA leads to
 */
export function trackCtaClick(params: {
  ctaText: string;
  ctaLocation: string;
  destination?: string;
}) {
  trackEvent("cta_click", {
    event_category: "Engagement",
    cta_text: params.ctaText,
    cta_location: params.ctaLocation,
    destination: params.destination,
  });
}

/**
 * Track page section views (for scroll tracking)
 * 
 * @param sectionName - Name of the section viewed
 */
export function trackSectionView(sectionName: string) {
  trackEvent("section_view", {
    event_category: "Content",
    section_name: sectionName,
  });
}
