// components/sections/HeroSection.tsx
"use client";

import React from "react";
import { QuoteButton } from "@/components/ui/QuoteButton";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");

  const badges = [
    t("badges.experience"),
    t("badges.specialists"),
    t("badges.moq"),
    t("badges.quality"),
  ];

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
          {t("brand")}
        </p>

        {/* H1 */}
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {t("title")}{" "}
          <span className="text-cashmere/85">{t("titleHighlight")}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-wool sm:text-lg">
          {t("subtitle")}
          <br className="hidden sm:block" />
          {t("subtitleLine2")}
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
          {/* Quote button with GA4 tracking */}
          <QuoteButton 
            source="hero_cta"
            productType="knitwear"
            className="h-12 px-6 text-sm font-semibold"
          >
            {t("cta")}
          </QuoteButton>

          <a
            href="#consultation"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-wool/50 bg-cashmere/5 px-6 text-sm font-semibold text-cashmere backdrop-blur transition hover:bg-cashmere/10"
          >
            {t("ctaSecondary")}
          </a>

          <span className="text-xs text-cashmere/60">
            {t("ctaNote")}
          </span>
        </div>
      </div>
    </section>
  );
}
