/**
 * INDUSTRIES DYNAMIC PAGE (INTERNATIONALIZED)
 * 
 * Route: /[locale]/industries/[slug]
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industrySlugs, getIndustryBySlug } from "@/app/data/industries";
import { generateIndustryMetadata } from "@/lib/seo";
import { CombinedSchema } from "@/components/seo/SeoSchema";
import { generateFAQSchema } from "@/lib/schema";
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return industrySlugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function IndustryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const faqSchema = industry.faq
    ? generateFAQSchema(industry.faq, `/industries/${slug}`)
    : null;

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
      <CombinedSchema schemas={[serviceSchema, faqSchema]} />

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {industry.h1}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{industry.intro}</p>
        </header>

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
              href="/contact-us"
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
