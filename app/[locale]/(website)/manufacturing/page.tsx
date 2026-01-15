import type { Metadata } from "next";
import ManufacturingHero from "@/components/sections/ManufacturingHero";
import ManufacturingSection from "@/components/sections/ManufacturingSection";
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Our Manufacturing Process | Professional Knitwear Production",
  description: "Explore Ever Knitting's comprehensive sweater manufacturing process. From premium yarn sourcing to advanced knitting and rigorous quality control.",
};

export default async function ManufacturingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-navy text-cashmere">
      <ManufacturingHero />

      <div className="bg-white text-gray-900 border-y border-wool/20">
        <ManufacturingSection
          title="1. Material Sourcing & Yarn Preparation"
          description="We source only the finest natural fibers, including Grade-A Mongolian cashmere, premium merino wool, and organic cotton. Before production begins, all yarns are inspected for color consistency, strength, and texture to ensure the highest quality foundation for your garments."
          images={[
            "/manufacturing/yarn-cones.png",
            "/products/alpaca-mohair.png",
            "/products/wool-blend.png"
          ]}
        />
      </div>

      <div className="bg-navy-deep text-cashmere border-b border-wool/20">
        <ManufacturingSection
          title="2. Advanced Computerized Knitting"
          description="Our facility is equipped with state-of-the-art Stoll and Shima Seiki computerized knitting machines ranging from 3GG to 18GG. This allows us to produce complex patterns, intricate textures, and seamless garments with extreme precision and minimal waste."
          images={[
            "/manufacturing/knitting-machine.png",
            "/products/womens-knitwear.png",
            "/products/mens-knitwear.png"
          ]}
        />
      </div>

      <div className="bg-white text-gray-900 border-b border-wool/20">
        <ManufacturingSection
          title="3. Manual Linking & Assembly"
          description="While knitting is automated, the assembly of high-end knitwear still requires the human touch. Our skilled craftsmen perform hand-linking to ensure clean, flat, and durable seams that provide superior comfort and a premium finish."
          images={[
            "/products/custom-development.png",
            "/manufacturing/quality-control.png"
          ]}
        />
      </div>

      <div className="bg-navy-deep text-cashmere">
        <ManufacturingSection
          title="4. Washing, Finishing & Quality Control"
          description="Every garment undergoes a specialized washing and treatment process to achieve the desired hand-feel and dimensional stability. Finally, our dedicated QC team inspects every piece against AQL 2.5 standards before careful steam-pressing and eco-friendly packaging."
          images={[
            "/manufacturing/quality-control.png",
            "/products/luxury-cashmere-crewneck-sweater.png"
          ]}
        />
      </div>

    </main>
  );
}
