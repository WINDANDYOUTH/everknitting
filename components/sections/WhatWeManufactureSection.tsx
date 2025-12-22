// app/components/WhatWeManufactureSection.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";

type Category = {
  key: string;
  label: string;
  image: string; // path from /public, e.g. "/products/cashmere-crewneck.png"
};

const CATEGORIES: Category[] = [
  {
    key: "cashmere",
    label: "Cashmere Sweaters",
    image: "/luxury-cashmere-crewneck-sweater.png",
  },
  {
    key: "wool",
    label: "Wool & Wool Blends",
    image: "/products/wool-blend.png",
  },
  {
    key: "alpaca",
    label: "Alpaca / Mohair Knits",
    image: "/products/alpaca-mohair.png",
  },
  {
    key: "men",
    label: "Men’s Knitwear",
    image: "/products/mens-knitwear.png",
  },
  {
    key: "women",
    label: "Women’s Knitwear",
    image: "/products/womens-knitwear.png",
  },
  {
    key: "custom",
    label: "Custom Knit Development",
    image: "/products/custom-development.png",
  },
];

export default function WhatWeManufactureSection() {
  const [activeKey, setActiveKey] = useState(CATEGORIES[0].key);

  // Crossfade: keep previous image for a moment
  const [prevKey, setPrevKey] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  // Preload cache: avoid preloading same image repeatedly
  const preloadedRef = useRef<Set<string>>(new Set());
  const fadeOutTimerRef = useRef<number | null>(null);

  const active = useMemo(
    () => CATEGORIES.find((c) => c.key === activeKey) ?? CATEGORIES[0],
    [activeKey]
  );
  const prev = useMemo(
    () => (prevKey ? CATEGORIES.find((c) => c.key === prevKey) : null),
    [prevKey]
  );

  const preloadImage = (src: string) => {
    if (!src || preloadedRef.current.has(src)) return;
    preloadedRef.current.add(src);
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
  };

  const switchTab = (nextKey: string) => {
    if (nextKey === activeKey) return;

    // set previous for crossfade
    setPrevKey(activeKey);

    // switch active
    setActiveKey(nextKey);

    // trigger fade-in of new image
    setFadeIn(false);
    requestAnimationFrame(() => setFadeIn(true));

    // clear previous after fade duration
    if (fadeOutTimerRef.current) window.clearTimeout(fadeOutTimerRef.current);
    fadeOutTimerRef.current = window.setTimeout(() => setPrevKey(null), 520);
  };

  return (
    <section className="bg-navy text-cashmere">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* LEFT — Image crossfade panel */}
          <div className="lg:col-span-6">
            <div className="relative min-h-[340px] overflow-hidden rounded-3xl border border-wool/35 bg-cashmere/5">
              {/* Previous (fade out) — only exists briefly */}
              {prev && prev.key !== active.key && (
                <div className="absolute inset-0 opacity-100 transition-opacity duration-500 ease-out">
                  <Image
                    src={prev.image}
                    alt={prev.label}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div aria-hidden className="absolute inset-0 bg-navy-deep/10" />
                </div>
              )}

              {/* Current (fade in) */}
              <div
                className={[
                  "absolute inset-0 transition-opacity duration-500 ease-out",
                  fadeIn ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                <Image
                  src={active.image}
                  alt={active.label}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  // only first image priority; others stay lazy until used
                  priority={active.key === CATEGORIES[0].key}
                />
                <div aria-hidden className="absolute inset-0 bg-navy-deep/10" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-wool/35 bg-navy-deep/25 px-3 py-2 text-xs text-cashmere/80 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-copper" />
                  {active.label}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What We Make
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-wool">
              Fully fashioned knitwear from 1.5gg to 16gg, developed to meet
              brand-specific standards.
            </p>

            {/* Tabs — 2 columns */}
            <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CATEGORIES.map((item) => {
                const isActive = item.key === active.key;

                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => switchTab(item.key)}
                      onMouseEnter={() => preloadImage(item.image)}
                      onFocus={() => preloadImage(item.image)}
                      className={[
                        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition",
                        isActive
                          ? "border-copper bg-cashmere/10 text-cashmere"
                          : "border-wool/35 bg-transparent text-cashmere/80 hover:bg-cashmere/5",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-2 w-2 rounded-full transition",
                          isActive ? "bg-copper" : "bg-wool",
                        ].join(" ")}
                      />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-xs text-cashmere/60">
              Hover (or focus) a category to preload its image, then click for
              an instant preview.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
