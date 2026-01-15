/**
 * SERVICES DYNAMIC PAGE (INTERNATIONALIZED)
 * 
 * Route: /[locale]/services/[slug]
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { servicesSlugs, getServiceBySlug } from "@/app/data/services";
import { generateServiceMetadata } from "@/lib/seo";
import { CombinedSchema } from "@/components/seo/SeoSchema";
import { generateServiceSchema, generateFAQSchema } from "@/lib/schema";
import { ServiceCTA } from "@/components/sections/ServiceCTA";
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Generate static params for all locales and slugs
 */
export async function generateStaticParams() {
  return servicesSlugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
 * Service page component
 */
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = generateServiceSchema(service, slug);
  const faqSchema = service.faq
    ? generateFAQSchema(service.faq, `/services/${slug}`)
    : null;

  return (
    <>
      <CombinedSchema schemas={[serviceSchema, faqSchema]} />

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {service.h1}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{service.intro}</p>
        </header>

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

        <ServiceCTA 
          serviceKeyword={service.keyword}
          serviceSlug={slug}
        />
      </article>
    </>
  );
}
