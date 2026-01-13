/**
 * SERVICES DYNAMIC PAGE
 * 
 * Route: /services/[slug]
 * Pages generated: One for each service in data/services.ts
 * 
 * SEO Strategy:
 * 1. Static generation (SSG) for instant loading and SEO
 * 2. Unique metadata per page via generateMetadata()
 * 3. Canonical URLs to prevent duplicate content
 * 4. JSON-LD structured data for rich results
 * 5. FAQ schema for featured snippets
 * 
 * This approach creates programmatic SEO pages that Google treats
 * as unique, valuable content (not thin/duplicate content).
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { servicesSlugs, getServiceBySlug } from "@/app/data/services";
import { generateServiceMetadata } from "@/lib/seo";
import { CombinedSchema } from "@/components/seo/SeoSchema";
import { generateServiceSchema, generateFAQSchema } from "@/lib/schema";

/**
 * GENERATE STATIC PARAMS
 * 
 * Purpose: Tell Next.js which dynamic routes to pre-render at build time
 * Result: All service pages are static HTML (not server-rendered on demand)
 * 
 * This is critical for SEO:
 * - Instant page loads (Core Web Vitals)
 * - Crawlable by search engines
 * - Can be cached on CDN
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  return servicesSlugs.map((slug) => ({
    slug,
  }));
}

/**
 * GENERATE METADATA
 * 
 * Purpose: Create unique SEO metadata for each service page
 * Runs at build time for static pages
 * 
 * Includes:
 * - Unique title (appears in search results and browser tab)
 * - Meta description (influences click-through rate)
 * - Canonical URL (prevents duplicate content issues)
 * - Open Graph tags (social media sharing)
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateServiceMetadata(service.title, service.description, slug);
}

/**
 * SERVICE PAGE COMPONENT
 * 
 * This is the actual page content rendered for each service.
 * 
 * Best practices implemented:
 * - Content pulled from data file (single source of truth)
 * - Semantic HTML (h1, section, article)
 * - Structured data matches visible content
 * - FAQ section for user value (not just SEO)
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  // Return 404 if service doesn't exist
  if (!service) {
    notFound();
  }

  // Generate schemas for this page
  const serviceSchema = generateServiceSchema(service, slug);
  const faqSchema = service.faq
    ? generateFAQSchema(service.faq, `/services/${slug}`)
    : null;

  return (
    <>
      {/* 
        JSON-LD STRUCTURED DATA
        
        Why: Tells Google exactly what this page is about
        Placement: Can be anywhere in the page (Next.js optimizes placement)
        Validation: Test at https://search.google.com/test/rich-results
        
        Using CombinedSchema to include both Service and FAQ markup
        in a single @graph structure (Google's recommended format)
      */}
      <CombinedSchema schemas={[serviceSchema, faqSchema]} />

      {/* 
        MAIN CONTENT SECTION
        
        Structure:
        - H1 matches metadata title and schema name
        - Intro provides unique value proposition
        - Use cases show specific applications
        - Content is unique per page (not templates with keyword swapping)
      */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {service.h1}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{service.intro}</p>
        </header>

        {/* Use Cases (if available) */}
        {service.useCases && service.useCases.length > 0 && (
          <section className="mb-12 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Ideal For:
            </h2>
            <ul className="space-y-2">
              {service.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{useCase}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 
          TODO: Add shared sections here
          These would be imported components used across all service pages:
          
          - <FactoryStrength /> - certifications, capacity, equipment
          - <ProductionProcess /> - step-by-step manufacturing flow
          - <QualityControl /> - QC standards and testing
          - <CaseStudies /> - relevant project examples
          
          These shared sections add value without creating duplicate content
          because the page-specific content above is unique.
        */}

        {/* 
          FAQ SECTION
          
          Critical for SEO:
          - Targets long-tail questions
          - Can appear as rich snippets in search
          - Provides real user value
          
          Requirements:
          - Questions must match common search queries
          - Answers must be complete and helpful
          - Content here must match FAQ schema exactly
        */}
        {service.faq && service.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {service.faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {item.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 
          CTA SECTION
          
          Convert SEO traffic to leads:
          - Clear next step
          - Low friction (no forms on this page)
          - Can link to contact page or quote request
        */}
        <section className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 text-blue-100">
            Contact us today for a consultation about your {service.keyword.toLowerCase()}{" "}
            project.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Request a Quote
          </a>
        </section>
      </article>
    </>
  );
}
