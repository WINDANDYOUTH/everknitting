// app/components/WhyEverKnittingSection.tsx
import React from "react";
import { QuoteButton } from "@/components/ui/QuoteButton";

type Proof = {
  title: string;
  description: string;
};

const chips = ["Reply in 12–24h", "Lab dips 5–7 days", "1.5gg–16gg", "OEM / ODM"];

const proofs: Proof[] = [
  {
    title: "30+ Years Manufacturing Experience",
    description:
      "Established in 1993 with a stable production system built for long-term brand partnerships.",
  },
  {
    title: "Fine-Gauge & Cashmere Specialists",
    description:
      "From premium cashmere to fine-gauge knitwear, we focus on hand-feel, stitch definition, and drape.",
  },
  {
    title: "Low MOQ & Flexible Sampling",
    description:
      "Efficient sampling workflow with practical options for early-stage development and repeat programs.",
  },
  {
    title: "Stable Quality & Bulk Consistency",
    description:
      "Process control from yarn selection to finishing, aligned to your standards and inspection checklist.",
  },
  {
    title: "On-Time Delivery, Clear Communication",
    description:
      "Transparent timelines and updates throughout sampling and production—no guessing, no surprises.",
  },
  {
    title: "Custom Labels & Packaging Support",
    description:
      "Woven labels, hangtags, folding, polybag / gift packaging—executed to match your brand presentation.",
  },
];

export default function WhyEverKnittingSection() {
  return (
    <section className="bg-navy text-cashmere" id="why-us">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Why Ever Knitting
            </h2>

            <p className="mt-4 text-base leading-relaxed text-wool">
              Factory-direct knitwear production since 1993—built for global
              brands that require consistent quality, reliable timelines, and
              professional development support.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-wool/40 bg-cashmere/5 px-3 py-1 text-xs text-cashmere/80 backdrop-blur"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Micro CTA */}
            <div className="mt-8 rounded-3xl border border-wool/35 bg-cashmere/5 p-6">
              <div className="text-sm font-semibold text-cashmere">
                Fast inquiry checklist
              </div>
              <ul className="mt-4 space-y-2 text-sm text-wool">
                {[
                  "Product type + reference images",
                  "Composition (cashmere / wool / blends)",
                  "Gauge + size range",
                  "Quantity per color/size",
                  "Target price & timeline",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Quote button with GA4 tracking */}
                <QuoteButton
                  source="why_us_section"
                  productType="knitwear"
                  className="inline-flex items-center justify-center rounded-2xl bg-copper px-5 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90"
                >
                  Request a Quote
                </QuoteButton>
                <span className="text-xs text-cashmere/60">
                  NDA available • Clear timeline & updates
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {proofs.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border border-wool/35 bg-cashmere/5 p-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-copper" />
                    <h3 className="text-base font-semibold text-cashmere">
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-wool">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-wool/35 bg-navy-deep/20 p-6">
              <p className="text-sm text-cashmere/80">
                If you already have a QC standard or inspection protocol, we can
                follow it across sampling and bulk production to ensure alignment.
              </p>
              <div className="mt-3 text-xs text-wool">
                Common options: pre-production sample • inline checks • final inspection
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
