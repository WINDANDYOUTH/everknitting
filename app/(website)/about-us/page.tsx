import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Ever Knitting",
  description: "Learn about Ever Knitting's history, our commitment to quality, and our mission to produce the world's finest knitwear.",
};

export default function AboutPage() {
  return (
    <div className="bg-navy min-h-screen text-cashmere">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-navy-deep overflow-hidden px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-copper to-transparent"></div>
        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            We Knit <span className="text-copper">Legacies</span>.
          </h1>
          <p className="text-xl text-wool">
            Since 2008, Ever Knitting has been the silent partner behind some of the world&apos;s most prestigious fashion brands.
          </p>
        </div>
      </section>

      {/* Content Columns */}
      <section className="py-24 px-6 lg:px-12 bg-navy">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-wool text-lg leading-relaxed">
              <p>
                Founded in the heart of Dongguan&apos;s textile district, Ever Knitting started with just five knitting machines and a dream to redefine quality.
              </p>
              <p>
                Over the last 15 years, we have expanded into a state-of-the-art facility employing over 200 skilled artisans and technicians. We blend traditional hand-finishing techniques with modern automated technology to deliver garments that truly stand out.
              </p>
              <p>
                We believe that every stitch matters. From the tension of the yarn to the final steam, our obsession with detail is what sets us apart.
              </p>
            </div>
          </div>
          <div className="h-96 w-full bg-navy-deep rounded-2xl border border-wool/10 relative overflow-hidden group">
            {/* Placeholder for factory image */}
            <div className="absolute inset-0 bg-copper/5 md:group-hover:bg-copper/10 transition-colors"></div>
            <div className="flex h-full items-center justify-center text-wool/20 text-4xl font-bold uppercase tracking-widest">
              Factory Floor
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-navy-deep px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Integrity", desc: "Honest pricing and transparent communication with all our clients." },
              { title: "Quality", desc: "Zero tolerance for defects. If it's not perfect, it doesn't leave our factory." },
              { title: "Innovation", desc: "Constantly exploring new knitting structures, yarns, and sustainable practices." }
            ].map((val, i) => (
              <div key={i} className="p-8 bg-navy rounded-xl border border-wool/10">
                <h3 className="text-xl font-bold text-copper mb-4">{val.title}</h3>
                <p className="text-wool">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
