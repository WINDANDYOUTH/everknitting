"use client";

import Script from "next/script";

/**
 * Google Tag Manager Component
 * 
 * This component loads GTM and provides a central hub for:
 * - Google Analytics 4 (GA4)
 * - Google Ads conversion tracking
 * - Bing Webmaster Tools / Microsoft Clarity
 * - Facebook Pixel
 * - Any other marketing/analytics tags
 * 
 * Configuration:
 * 1. Set GTM_ID in environment variables: NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 * 2. Configure GA4 and other tags within GTM dashboard
 * 
 * Usage in layout.tsx:
 * import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
 * 
 * <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
 */

interface GoogleTagManagerProps {
  gtmId?: string;
}

export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  // Don't render if no GTM ID provided
  if (!gtmId) {
    if (process.env.NODE_ENV === "development") {
      console.warn("GoogleTagManager: No GTM ID provided. Analytics disabled.");
    }
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
}

/**
 * GTM NoScript Fallback
 * 
 * This component provides a noscript fallback for GTM.
 * Place this immediately after the opening <body> tag.
 */
interface GTMNoScriptProps {
  gtmId?: string;
}

export function GTMNoScript({ gtmId }: GTMNoScriptProps) {
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
