// app/components/HowWeWorkSection.tsx
import React from "react";

type Step = {
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    title: "1) Share Requirements",
    description:
      "Send tech pack / reference images, target composition, gauge, size range, quantity, and target price.",
  },
  {
    title: "2) Yarn & Sampling Plan",
    description:
      "We propose yarn options, gauge, techniques, and timeline. Lab dips & swatches available if needed.",
  },
  {
    title: "3) Sample Development",
    description:
      "Sample making, fitting review, and revisions until approval. We align hand-feel and workmanship to your standard.",
  },
  {
    title: "4) Bulk Production",
    description:
      "Factory-direct knitting and finishing with consistent process control for stable bulk quality.",
  },
  {
    title: "5) QC & Packing",
    description:
      "Inspection based on agreed checklist, then labels, hangtags, folding, and packaging per your requirements.",
  },
  {
    title: "6) Shipping & Delivery",
    description:
      "We arrange shipment and provide tracking. On-time delivery with clear communication throughout the order.",
  },
];

export default function HowWeWorkSection() {
  return (
    <section className="bg-navy text-cashmere" id="process">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How We Work
            </h2>
            <p className="mt-4 text-base leading-relaxed text-wool">
              A clear factory workflow from sampling to bulk orders—built for
              global brands that care about quality, timelines, and consistency.
            </p>

            <div className="mt-8 rounded-3xl border border-wool/35 bg-cashmere/5 p-6">
              <div className="text-sm font-semibold text-cashmere">
                What we need to quote faster
              </div>
              <ul className="mt-4 space-y-2 text-sm text-wool">
                {[
                  "Product type + reference images",
                  "Composition (cashmere/wool/blends)",
                  "Gauge (or target thickness/hand-feel)",
                  "Size range + measurement chart",
                  "Quantity per color/size",
                  "Target market & target price",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-2xl bg-copper px-5 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90"
                >
                  Start an Inquiry
                </a>
                <span className="text-xs text-cashmere/60">
                  Reply in 12–24 hours • NDA available
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((s) => (
                <div
                  key={s.title}
                  className="rounded-3xl border border-wool/35 bg-cashmere/5 p-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-copper" />
                    <h3 className="text-base font-semibold text-cashmere">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-wool">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-wool/35 bg-navy-deep/20 p-6">
              <p className="text-sm text-cashmere/80">
                We can align to your QC checklist and packaging standards. If you
                have an inspection protocol, we’ll follow it throughout production.
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
