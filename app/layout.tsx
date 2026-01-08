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
 */

import "./globals.css";
import type { Metadata } from "next";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema";

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

import Header from "@/components/sections/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate site-wide schemas
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className="scroll-smooth">
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
        <Header />
        {children}
      </body>
    </html>
  );
}
