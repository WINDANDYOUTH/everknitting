// app/components/HeroSection.tsx
import React from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";

const badges = [
  "30+ years knitting experience",
  "Cashmere & fine-gauge specialists",
  "Low MOQ & flexible sampling",
  "Stable quality & on-time delivery",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy text-cashmere">
      {/* subtle, textile-like light */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-cashmere/10 via-transparent to-navy-deep/35"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(237,230,216,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(237,230,216,0.55)_1px,transparent_1px)] bg-size-[72px_72px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        {/* Brand one-liner */}
        <p className="text-sm font-medium tracking-wide text-cashmere/75">
          Ever Knitting Company Limited
        </p>

        {/* H1 */}
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Premium Cashmere &amp; Knitwear Manufacturer{" "}
          <span className="text-cashmere/85">Since 1993</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-wool sm:text-lg">
          Factory-direct production of high-quality cashmere sweaters and knitted
          garments.
          <br className="hidden sm:block" />
          From sampling to bulk orders, tailored for global brands.
        </p>

        {/* Badges */}
        <div className="mt-7 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-wool/40 bg-cashmere/5 px-3 py-1 text-xs text-cashmere/85 backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <RainbowButton className="h-12 px-6 text-sm font-semibold">
            Request a Quote
          </RainbowButton>

          <a
            href="#consultation"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-wool/50 bg-cashmere/5 px-6 text-sm font-semibold text-cashmere backdrop-blur transition hover:bg-cashmere/10"
          >
            Get Free Sample Consultation
          </a>

          <span className="text-xs text-cashmere/60">
            Reply in 12–24 hours • NDA available
          </span>
        </div>
      </div>
    </section>
  );
}
