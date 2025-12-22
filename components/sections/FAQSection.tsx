// app/components/sections/FAQSection.tsx
"use client";

import React, { useState } from "react";

export type FAQ = { q: string; a: string };

export const faqs: FAQ[] = [
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: "MOQ depends on the product type, gauge, and yarn. For cashmere and fine-gauge knitwear, MOQ usually starts from 100–300 pcs per style, with flexibility for sampling and repeat programs.",
  },
  {
    q: "Do you offer sampling before bulk production?",
    a: "Yes. We provide sample development before bulk orders. Sampling includes yarn selection, gauge confirmation, fitting review, and revisions until approval.",
  },
  {
    q: "What is the typical lead time for samples?",
    a: "Sample lead time is usually 7–14 days after confirming yarn, gauge, and design details. Lab dips and swatches may take 5–7 days if required.",
  },
  {
    q: "What is the bulk production lead time?",
    a: "Bulk lead time depends on order quantity, yarn availability, and seasonality. Typically, production takes 30–45 days after sample approval.",
  },
  {
    q: "Can you match our quality and hand-feel standards?",
    a: "Yes. We work based on your reference samples, QC checklist, and target hand-feel. Yarn selection, finishing, and process control are aligned to your standards.",
  },
  {
    q: "Do you support custom labels and packaging?",
    a: "Yes. We support woven labels, printed labels, hangtags, folding, polybags, and custom packaging according to your brand requirements.",
  },
  {
    q: "Where do you ship to?",
    a: "We ship worldwide. Shipping methods and costs depend on destination, order volume, and delivery timeline.",
  },
  {
    q: "Is an NDA available?",
    a: "Yes. We can sign an NDA before reviewing your designs or tech packs upon request.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-navy text-cashmere" id="faq">
      {/* ... keep your existing UI exactly the same ... */}
      {/* (omitted here for brevity) */}
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-wool">
          Answers to common questions about sampling, production, quality control,
          and cooperation with Ever Knitting.
        </p>

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.q}
                className="rounded-3xl border border-wool/35 bg-cashmere/5"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium sm:text-base">
                    {item.q}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                      isOpen
                        ? "border-copper bg-copper text-navy"
                        : "border-wool text-cashmere"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-wool">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-wool/35 bg-navy-deep/20 p-6">
          <p className="text-sm text-cashmere/80">
            Still have questions? Share your project details and we’ll respond
            with clear answers and next steps.
          </p>
          <div className="mt-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-2xl bg-copper px-5 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90"
            >
              Start Your Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
