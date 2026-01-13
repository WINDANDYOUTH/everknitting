import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Manufacturing Process | Precision & Craftsmanship",
  description: "Discover our step-by-step knitwear manufacturing process, from design consultation and sampling to production and quality control.",
};

export default function ProcessPage() {
  const steps = [
    {
      number: "01",
      title: "Design & Consultation",
      desc: "We begin by understanding your vision. Our design team collaborates with you to select yarns, define gauges, and finalize tech packs.",
    },
    {
      number: "02",
      title: "Prototyping & Sampling",
      desc: "We create a physical sample for your approval. This ensures the fit, feel, and look meet your exact specifications before bulk production.",
    },
    {
      number: "03",
      title: "Bulk Production",
      desc: "Using state-of-the-art Shima Seiki and Stoll machines, we begin mass production with strict adherence to the approved sample.",
    },
    {
      number: "04",
      title: "Quality Control",
      desc: "Every piece undergoes a multi-stage inspection process. We check for measurements, knitting defects, and finishing quality.",
    },
    {
      number: "05",
      title: "Finishing & Packaging",
      desc: "Garments are washed, steamed, labeled, and packed according to your retail requirements, ready for shipment.",
    }
  ];

  return (
    <div className="bg-navy min-h-screen text-cashmere">
      {/* Hero */}
      <section className="px-6 py-24 md:py-32 text-center bg-navy-deep relative overflow-hidden">
        <div className="max-w-4xl mx-auto z-10 relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The <span className="text-copper">Art</span> of Production
          </h1>
          <p className="text-lg md:text-xl text-wool">
            Precision engineering meets artisanal craftsmanship. See how we bring your designs to life.
          </p>
        </div>
      </section>

      {/* Timeline Steps */}
      <section className="px-6 py-20 bg-navy relative">
        <div className="max-w-5xl mx-auto">
          <div className="relative border-l border-wool/20 ml-4 md:ml-12 space-y-16">
            {steps.map((step, idx) => (
              <div key={idx} className="relative pl-12 md:pl-20 group">
                {/* Number Bubble */}
                <div className="absolute -left-5 md:-left-6 top-0 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-navy-deep border-2 border-copper text-copper font-bold text-lg md:text-xl shadow-[0_0_15px_rgba(184,115,51,0.3)] transition-transform group-hover:scale-110">
                  {step.number}
                </div>
                
                {/* Content */}
                <div className="bg-navy-deep/50 p-6 md:p-8 rounded-2xl border border-wool/10 hover:border-copper/30 transition-all hover:bg-navy-deep">
                  <h3 className="text-2xl font-semibold mb-3 text-cashmere group-hover:text-copper transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-wool leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 bg-navy-deep border-t border-wool/10 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
        <button className="px-8 py-3 rounded-full bg-copper text-navy font-bold hover:bg-white transition-colors">
          Start Your Project
        </button>
      </section>
    </div>
  );
}
