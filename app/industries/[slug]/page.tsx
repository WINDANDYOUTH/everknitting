/**
 * INDUSTRIES DYNAMIC PAGE
 * 
 * Route: /industries/[slug]
 * Purpose: Target specific B2B audience segments with tailored messaging
 * 
 * Strategy:
 * - Same technical infrastructure as services/products
 * - Different content structure: pain points + solutions
 * - More consultative tone (B2B decision makers)
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { industrySlugs, getIndustryBySlug } from "@/app/data/industries";
import { generateIndustryMetadata } from "@/lib/seo";
import { CombinedSchema } from "@/components/seo/SeoSchema";
import { generateFAQSchema } from "@/lib/schema";

/**
 * Generate all industry pages at build time (SSG)
 */
export async function generateStaticParams() {
  return industrySlugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate unique metadata for each industry page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateIndustryMetadata(industry.title, industry.description, slug);
}

/**
 * Industry page component
 */
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  // Generate FAQ schema (industries use FAQ prominently)
  const faqSchema = industry.faq
    ? generateFAQSchema(industry.faq, `/industries/${slug}`)
    : null;

  // Industry pages can also use Service schema since we're describing
  // services for specific industries
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: industry.h1,
    description: industry.intro,
    provider: {
      "@type": "Organization",
      name: "Ever Knitting",
    },
    serviceType: "Knitwear Manufacturing",
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <CombinedSchema schemas={[serviceSchema, faqSchema]} />

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {industry.h1}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{industry.intro}</p>
        </header>

        {/* 
          PAIN POINTS SECTION
          
          Purpose: Show we understand industry-specific challenges
          SEO: Targets problem-aware search queries
          Conversion: Builds trust through empathy
        */}
        {industry.painPoints && industry.painPoints.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Common Challenges We Solve
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {industry.painPoints.map((painPoint, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start"
                >
                  <svg
                    className="w-6 h-6 text-red-600 mr-3 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {painPoint}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 
          SOLUTIONS SECTION
          
          Purpose: Position our specific capabilities as solutions
          Structure: Mirrors pain points for clarity
        */}
        {industry.solutions && industry.solutions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Our Solutions for {industry.keyword}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {industry.solutions.map((solution, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start"
                >
                  <svg
                    className="w-6 h-6 text-green-600 mr-3 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {solution}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 
          PROCESS OVERVIEW
          
          Optional section showing how we work with this industry
          Can be customized per industry or use shared component
        */}
        <section className="mb-12 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            How We Work Together
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Consultation",
                desc: "Discuss your requirements and challenges",
              },
              {
                step: "2",
                title: "Proposal",
                desc: "Receive detailed quote and timeline",
              },
              {
                step: "3",
                title: "Sampling",
                desc: "Review and approve sample products",
              },
              {
                step: "4",
                title: "Production",
                desc: "Full-scale manufacturing and delivery",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {industry.faq && industry.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {industry.faq.map((item, index) => (
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

        {/* CTA Section */}
        <section className="mt-16 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Partner with Us
          </h2>
          <p className="text-lg mb-6 text-indigo-100">
            Join the hundreds of {industry.keyword.toLowerCase()} who trust Ever Knitting
            for their manufacturing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/products"
              className="inline-block bg-indigo-700 text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
            >
              View Our Products
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
