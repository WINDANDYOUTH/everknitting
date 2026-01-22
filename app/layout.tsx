/**
 * ROOT LAYOUT
 * 
 * This layout wraps all pages in the application.
 * 
 * SEO elements in this file:
 * 1. Default metadata (overridden by page-specific metadata)
 * 2. Site-wide JSON-LD schemas (Organization, Website)
 * 3. HTML lang attribute for internationalization
 * 4. Semantic HTML structure
 * 
 * Analytics:
 * - Google Tag Manager (manages GA4, Bing, and other trackers)
 */

import "./globals.css";
import type { Metadata } from "next";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema";
import { GoogleTagManager, GTMNoScript } from "@/components/analytics";

/**
 * Default metadata
 * This is overridden by page-specific generateMetadata() functions
 */
export const metadata: Metadata = {
  title: {
    default: "Ever Knitting | Professional Knitwear Manufacturer in China and Cambodia",
    template: "%s | Ever Knitting",
  },
  description:
    "Ever Knitting is a professional knitwear manufacturer offering OEM & ODM services for fashion brands, wholesalers, and private label companies. ISO-certified factory with 15+ years experience.",
  keywords: [
    "knitwear manufacturer",
    "sweater factory",
    "OEM knitwear",
    "ODM sweater manufacturing",
    "cashmere manufacturer",
    "China knitwear factory",
  ],
  authors: [{ name: "Ever Knitting" }],
  creator: "Ever Knitting",
  publisher: "Ever Knitting",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate site-wide schemas
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <ClerkProvider>
      <html className="scroll-smooth" suppressHydrationWarning>
        <head>
          {/*
            SITE-WIDE STRUCTURED DATA
            
            These schemas appear on every page:
            - Organization: Business entity information
            - WebSite: Site-level information
            
            Page-specific schemas (Service, Product, FAQ) are added
            by individual page components.
          */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [organizationSchema, websiteSchema],
              }),
            }}
            suppressHydrationWarning
          />
        </head>
        <body className="antialiased font-sans" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* GTM NoScript Fallback - loads when JavaScript is disabled */}
            <GTMNoScript gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
            
            {/* Google Tag Manager - loads after page becomes interactive */}
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
            
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
