import React from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'materials' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function MaterialsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-navy-deep min-h-screen text-cashmere">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-copper">Exquisite</span> Materials
          </h1>
          <p className="mt-6 text-lg md:text-xl text-wool max-w-2xl mx-auto leading-relaxed">
            We source only the finest yarns from around the globe. Does your brand require
            silky cashmere, durable merino, or sustainable organic cotton? We have the perfect fiber for every masterpiece.
          </p>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-navy via-navy-deep to-navy-deep opacity-50 z-0"></div>
      </section>

      {/* Material Grid */}
      <section className="px-6 py-16 lg:px-8 bg-navy">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Material Card 1: Cashmere */}
            <div className="group relative overflow-hidden rounded-2xl bg-navy-deep p-8 transition-all hover:shadow-[0_0_40px_rgba(184,115,51,0.1)] border border-wool/10 hover:border-copper/30">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-navy/50 text-copper group-hover:bg-copper group-hover:text-navy transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12c0-4.4 3.6-8 8-8 4.4 0 8 3.6 8 8 0 2.1-1.6 4-3.5 4.5l-1 5.5h-7l-1-5.5C3.3 15.1 2.5 13.9 2.5 12z"/><path d="M12.5 2h-1"/></svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Pure Cashmere</h3>
              <p className="text-wool leading-relaxed">
                Known as &quot;soft gold,&quot; our cashmere is sourced from inner Mongolia. It offers unparalleled softness, warmth, and luxury for premium collections.
              </p>
            </div>

            {/* Material Card 2: Merino Wool */}
            <div className="group relative overflow-hidden rounded-2xl bg-navy-deep p-8 transition-all hover:shadow-[0_0_40px_rgba(184,115,51,0.1)] border border-wool/10 hover:border-copper/30">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-navy/50 text-copper group-hover:bg-copper group-hover:text-navy transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12s2-4 4-4 4 4 4 4"/><path d="M8 12s2 4 4 4 4-4 4-4"/></svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Merino Wool</h3>
              <p className="text-wool leading-relaxed">
                Extra-fine Merino wool that is breathable, moisture-wicking, and incredibly soft against the skin. Perfect for versatile, year-round knitwear.
              </p>
            </div>

            {/* Material Card 3: Cotton & Blends */}
            <div className="group relative overflow-hidden rounded-2xl bg-navy-deep p-8 transition-all hover:shadow-[0_0_40px_rgba(184,115,51,0.1)] border border-wool/10 hover:border-copper/30">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-navy/50 text-copper group-hover:bg-copper group-hover:text-navy transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Cotton & Eco Blends</h3>
              <p className="text-wool leading-relaxed">
                 Organic cotton, recycled polyester, and innovative eco-blends for the environmentally conscious brand. Sustainable without compromising quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Section */}
      <section className="px-6 py-24 bg-navy-deep border-t border-wool/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Global Sourcing,<br/><span className="text-copper">Unmatched Quality</span></h2>
             <p className="text-wool text-lg mb-8 leading-relaxed">
               Our material sourcing team travels the world to find yarns that meet our rigorous standards. 
               We maintain strong relationships with top-tier spinners in Italy, Japan, and Peru to ensure consistency and excellence in every spool.
             </p>
             <button className="px-8 py-3 rounded-full bg-copper text-navy font-bold hover:bg-white hover:scale-105 transition-all">
               View All Yarns
             </button>
           </div>
           <div className="flex-1 h-64 md:h-96 w-full rounded-2xl bg-navy border border-wool/10 flex items-center justify-center overflow-hidden relative">
              {/* Abstract yarn visualization */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(184,115,51,0.05)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-rainbow"></div>
              <span className="text-wool/30 font-bold text-4xl">Premium Yarn Image</span>
           </div>
        </div>
      </section>
    </div>
  );
}
