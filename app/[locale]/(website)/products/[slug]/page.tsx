/**
 * PRODUCTS DYNAMIC PAGE (INTERNATIONALIZED)
 * 
 * Route: /[locale]/products/[slug]
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productSlugs, getProductBySlug } from "@/app/data/products";
import { generateProductMetadata } from "@/lib/seo";
import { CombinedSchema } from "@/components/seo/SeoSchema";
import { generateProductSchema, generateFAQSchema } from "@/lib/schema";
import { ProductCTA } from "@/components/sections/ProductCTA";
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return productSlugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateProductMetadata(product.title, product.description, slug);
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema(product, slug);
  const faqSchema = product.faq
    ? generateFAQSchema(product.faq, `/products/${slug}`)
    : null;

  return (
    <>
      <CombinedSchema schemas={[productSchema, faqSchema]} />

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {product.h1}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{product.intro}</p>
        </header>

        {product.specifications && (
          <section className="mb-12 bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Manufacturing Specifications
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {product.specifications.materials && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    Materials
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {product.specifications.materials.map((material, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications.gauges && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                    Knit Gauges
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {product.specifications.gauges.map((gauge, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {gauge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications.techniques && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Techniques
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {product.specifications.techniques.map((technique, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {technique}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {product.applications && product.applications.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Common Applications
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.applications.map((application, index) => (
                <div
                  key={index}
                  className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center"
                >
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-800 font-medium">{application}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {product.faq && product.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {product.faq.map((item, index) => (
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

        <ProductCTA 
          productKeyword={product.keyword}
          productSlug={slug}
        />
      </article>
    </>
  );
}
