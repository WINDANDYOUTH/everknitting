// app/[locale]/(website)/page.tsx
import HeroSection from "@/components/sections/HeroSection";
import WhatWeManufactureSection from "@/components/sections/WhatWeManufactureSection";
import MaterialsSection from "@/components/sections/MaterialsSection";
import MobileMaterialsStack from "@/components/sections/MobileMaterialsStack";
import HowWeWorkSection from "@/components/sections/HowWeWork";
import WhyEverKnittingSection from "@/components/sections/WhyEverKnittingSection";
import StartYourProjectSection from "@/components/sections/StartYourProjectSection";
import FAQSection, { faqs } from "@/components/sections/FAQSection";
import JSONLD from "@/components/seo/JSONLD";
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateAlternateLanguages } from '@/components/seo/AlternateLanguages';

export const runtime = 'edge';

type Props = {
  params: Promise<{ locale: string }>;
};

// Generate metadata for SEO with hreflang alternates
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: generateAlternateLanguages(''),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-navy text-cashmere">
      <HeroSection />
      <WhatWeManufactureSection />
      
      <div className="hidden md:block">
        <MaterialsSection />
      </div>
      <div className="md:hidden">
        <MobileMaterialsStack />
      </div>

      <HowWeWorkSection />
      <WhyEverKnittingSection />
      <StartYourProjectSection />
      <FAQSection />
      {/* ✅ SEO JSON-LD (server component) */}
      <JSONLD faqs={faqs} />
    </main>
  );
}
