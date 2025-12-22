// app/page.tsx
import HeroSection from "../components/sections/HeroSection";
import WhatWeManufactureSection from "@/components/sections/WhatWeManufactureSection";
import MaterialsSection from "@/components/sections/MaterialsSection";
import MobileMaterialsStack from "@/components/sections/MobileMaterialsStack";
import HowWeWorkSection from "@/components/sections/HowWeWork";
import WhyEverKnittingSection from "@/components/sections/WhyEverKnittingSection";
import StartYourProjectSection from "@/components/sections/StartYourProjectSection";
import FAQSection, { faqs } from "@/components/sections/FAQSection";
import JSONLD from "@/components/seo/JSONLD";

import Footer from "@/components/sections/Footer";

export default function HomePage() {
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
      <Footer />
      {/* ✅ SEO JSON-LD (server component) */}
      <JSONLD faqs={faqs} />
    </main>
  );
}
