// components/sections/MobileMaterialsStack.tsx
"use client";

import React from "react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const MATERIAL_CARDS = [
  {
    title: "Cashmere",
    description: "Ultra-soft, luxury grade fibers sourced from inner Mongolia. Perfect for high-end boutique collections.",
    features: ["100% Pure Cashmere", "Anti-pilling treatment", "Buttery hand-feel"],
    color: "bg-navy-deep",
  },
  {
    title: "Merino Wool",
    description: "Fine merino wool with excellent thermal regulation and durability for everyday premium wear.",
    features: ["Superfine 17.5μm", "Machine washable options", "Natural elasticity"],
    color: "bg-navy",
  },
  {
    title: "Alpaca Blend",
    description: "Lightweight and incredibly warm with a unique silky texture and beautiful halo effect.",
    features: ["Sustainably sourced", "Hypoallergenic", "Deep texture"],
    color: "bg-[#1a2329]",
  },
  {
    title: "Cotton Blends",
    description: "Breathable and soft blends for trans-seasonal pieces and versatile knitwear staples.",
    features: ["Organic cotton", "Performance silk blends", "Stability focus"],
    color: "bg-[#252f38]",
  },
];

export default function MobileMaterialsStack() {
  return (
    <div className="md:hidden block bg-navy py-12">
      <div className="px-6 mb-8">
        <h2 className="text-3xl font-bold text-cashmere">Our Premium Materials</h2>
        <p className="mt-2 text-wool text-sm uppercase tracking-widest">Scroll to explore</p>
      </div>
      
      <div className="h-[70vh]">
        <ScrollStack
          itemDistance={40}
          itemStackDistance={20}
          stackPosition="15%"
          baseScale={0.92}
          useWindowScroll={true}
        >
          {MATERIAL_CARDS.map((card, index) => (
            <ScrollStackItem key={index} itemClassName={`${card.color} border border-wool/20 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-4 w-1 bg-copper rounded-full" />
                  <h3 className="text-2xl font-bold text-cashmere">{card.title}</h3>
                </div>
                <p className="text-wool text-sm leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {card.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-cashmere/70">
                    <div className="h-1.5 w-1.5 rounded-full bg-copper/50" />
                    {f}
                  </div>
                ))}
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
      
      {/* Spacer to allow scrolling past the fixed height stack container if needed */}
      <div className="h-20" />
    </div>
  );
}
