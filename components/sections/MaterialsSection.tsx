// app/components/MaterialsSection.tsx
import React from "react";

type Card = {
  title: string;
  subtitle: string;
  points: string[];
};

const proofChips = ["Swatches available", "Lab dips 5–7 days", "1.5gg–16gg supported"];

const weControl = [
  "Hand-feel matching (based on your reference)",
  "Pilling / shedding control",
  "Color consistency (lab dips & approvals)",
  "Gauge stability & shrinkage control",
  "Bulk lot consistency",
];

const cards: Card[] = [
  {
    title: "Cashmere",
    subtitle: "Luxury softness, warmth, and drape for premium collections.",
    points: ["2-ply / 4-ply options", "Fine-gauge capable (up to 16gg)", "Anti-pilling focus"],
  },
  {
    title: "Wool & Wool Blends",
    subtitle: "Versatile yarns for seasonal staples and everyday knitwear.",
    points: ["Merino / lambswool options", "Blend support (nylon, silk, etc.)", "Stable bulk consistency"],
  },
  {
    title: "Alpaca / Mohair",
    subtitle: "Loft, texture, and halo—ideal for fashion-forward styles.",
    points: ["Halo control & shedding control", "Brushed / boucle looks", "Color development support"],
  },
  {
    title: "Blends & Finishing",
    subtitle: "Engineering the final feel and performance for your standards.",
    points: ["Softening / washing guidance", "Brushing & halo control", "Anti-pilling & durability tuning"],
  },
];

export default function MaterialsSection() {
  return (
    <section className="bg-navy text-cashmere">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Materials &amp; Yarns
            </h2>

            <p className="mt-4 text-base leading-relaxed text-wool">
              We source and develop yarns to meet brand-specific standards—hand-feel,
              gauge performance, color consistency, and bulk reliability.
            </p>

            {/* Proof chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {proofChips.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-wool/40 bg-cashmere/5 px-3 py-1 text-xs text-cashmere/80 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* What we control */}
            <div className="mt-8 rounded-3xl border border-wool/35 bg-cashmere/5 p-6">
              <div className="text-sm font-semibold text-cashmere">
                What we control
              </div>

              <ul className="mt-4 space-y-2 text-sm text-wool">
                {weControl.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              {/* Micro CTA */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-2xl bg-copper px-5 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90"
                >
                  Send Reference → Get Yarn Options
                </a>
                <span className="text-xs text-cashmere/60">
                  Share composition, gauge, hand-feel target, and target price.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-3xl border border-wool/35 bg-cashmere/5 p-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-copper" />
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                  </div>

                  <p className="mt-2 text-sm text-wool">{c.subtitle}</p>

                  <ul className="mt-4 space-y-2 text-sm text-cashmere/80">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper/80" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-6 rounded-3xl border border-wool/35 bg-navy-deep/20 p-6">
              <p className="text-sm text-cashmere/80">
                If you have a benchmark sample, we can propose yarn options and finishing
                approaches to match your target hand-feel, appearance, and care requirements.
              </p>
              <div className="mt-3 text-xs text-wool">
                Common support: lab dips • swatches • yarn suggestions • finishing guidance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
