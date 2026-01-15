import React from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

type FAQItem = {
  q: string;
  a: string;
};

const faqs: FAQItem[] = [
  {
    q: "What is your Minimum Order Quantity (MOQ)?",
    a: "Our standard MOQ is 200 pieces per style, which can be split into different sizes and 2 colorways. For premium materials like Cashmere, we can sometimes accommodate lower quantities. Please contact us for specific inquiries."
  },
  {
    q: "What is your sampling lead time?",
    a: "Ideally, initial prototyping takes 7-14 days depending on yarn availability. Complex patterns or custom-dyed yarns may require additional time."
  },
  {
    q: "Do you offer private labeling services?",
    a: "Yes, we are a full-service OEM/ODM manufacturer. We can produce custom woven labels, hang tags, and packaging with your brand identity."
  },
  {
    q: "Where is your factory located?",
    a: "Our main production facility is located in Dongguan, China – a global hub for high-quality knitwear manufacturing. We welcome client visits by appointment."
  },
  {
    q: "Can you source sustainable yarns?",
    a: "Absolutely. We work with certified suppliers for RWS (Responsible Wool Standard) wool, organic cotton, and recycled synthetic fibers. Sustainability is a core part of our mission."
  }
];

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-navy min-h-screen text-cashmere">
      <section className="py-24 px-6 text-center bg-navy-deep">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Frequently Asked <span className="text-copper">Questions</span>
        </h1>
        <p className="text-wool max-w-xl mx-auto">
          Everything you need to know about working with Ever Knitting.
        </p>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {faqs.map((item, i) => (
            <div key={i} className="bg-navy-deep p-8 rounded-2xl border border-wool/10 hover:border-copper/30 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-cashmere">{item.q}</h3>
              <p className="text-wool leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <p className="text-wool mb-6">Can&apos;t find what you&apos;re looking for?</p>
        <Link href="/contact-us" className="inline-block px-8 py-3 rounded-xl border border-copper text-copper font-medium hover:bg-copper hover:text-navy transition-colors">
          Contact Support
        </Link>
      </section>
    </div>
  );
}
