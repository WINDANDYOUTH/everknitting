// components/sections/MobileMaterialsStack.tsx
"use client";

import React from "react";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

const MATERIAL_CARDS = [
  {
    title: "Cashmere",
    description: "Ultra-soft, luxury grade fibers sourced from inner Mongolia. Perfect for high-end boutique collections.",
    features: ["100% Pure Cashmere", "Anti-pilling treatment", "Buttery hand-feel"],
    gradient: "from-navy-deep/95 to-navy/90",
  },
  {
    title: "Merino Wool",
    description: "Fine merino wool with excellent thermal regulation and durability for everyday premium wear.",
    features: ["Superfine 17.5μm", "Machine washable options", "Natural elasticity"],
    gradient: "from-navy/95 to-navy-deep/90",
  },
  {
    title: "Alpaca Blend",
    description: "Lightweight and incredibly warm with a unique silky texture and beautiful halo effect.",
    features: ["Sustainably sourced", "Hypoallergenic", "Deep texture"],
    gradient: "from-[#1a2329]/95 to-navy-deep/90",
  },
  {
    title: "Cotton Blends",
    description: "Breathable and soft blends for trans-seasonal pieces and versatile knitwear staples.",
    features: ["Organic cotton", "Performance silk blends", "Stability focus"],
    gradient: "from-[#252f38]/95 to-navy/90",
  },
];

export default function MobileMaterialsStack() {
  return (
    <div className="md:hidden block bg-linear-to-b from-navy via-navy-deep to-navy py-16">
      {/* Header Section */}
      <div className="px-6 mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-1 w-12 bg-linear-to-r from-copper to-copper/50 rounded-full" />
          <span className="text-copper text-xs uppercase tracking-[0.2em] font-semibold">Premium Quality</span>
        </div>
        <h2 className="text-4xl font-bold text-cashmere mb-3 leading-tight">
          Our Premium Materials
        </h2>
        <p className="text-wool/80 text-sm leading-relaxed max-w-md">
          Discover the finest yarns and fibers, carefully sourced for exceptional quality and performance.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px w-8 bg-copper/50" />
          <p className="text-copper/70 text-xs uppercase tracking-widest">Scroll to explore</p>
          <div className="h-px flex-1 bg-copper/20" />
        </div>
      </div>
      
      <ScrollStack useWindowScroll={true}>
        {MATERIAL_CARDS.map((card, index) => (
          <ScrollStackItem 
            key={index} 
            itemClassName={`bg-linear-to-br ${card.gradient} border border-cashmere/10 flex flex-col justify-between`}
          >
            {/* Card Header */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-1.5 bg-linear-to-b from-copper to-copper/50 rounded-full" />
                  <h3 className="text-2xl md:text-3xl font-bold text-cashmere tracking-tight">
                    {card.title}
                  </h3>
                </div>
                {/* Card number indicator */}
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-cashmere/5 border border-cashmere/10">
                  <span className="text-xs font-bold text-copper/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-cashmere/70 text-sm md:text-base leading-relaxed mb-6">
                {card.description}
              </p>
            </div>
            
            {/* Features Section */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-copper/20" />
                <span className="text-copper/60 text-[10px] uppercase tracking-widest font-semibold">
                  Key Features
                </span>
                <div className="h-px flex-1 bg-copper/20" />
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                {card.features.map((feature) => (
                  <div 
                    key={feature} 
                    className="flex items-center gap-2.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-copper/70 shrink-0" />
                    <span className="text-sm text-cashmere/90 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
      
      {/* Bottom Section */}
      <div className="px-6 mt-16">
        <div className="rounded-3xl border border-cashmere/10 bg-navy-deep/40 p-6 text-center">
          <p className="text-cashmere/80 text-sm leading-relaxed mb-3">
            Need a custom material or yarn specification?
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 text-copper text-sm font-semibold"
          >
            <span>Get in touch with our material experts</span>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Extra spacer for smooth scroll completion */}
      <div className="h-24" />
    </div>
  );
}
