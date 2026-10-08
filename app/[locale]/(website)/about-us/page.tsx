import React from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from 'next-intl/server';

export const runtime = 'edge';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="bg-navy min-h-screen text-cashmere">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-navy-deep overflow-hidden px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-copper to-transparent"></div>
        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {t('heroTitle')} <span className="text-copper">{t('heroHighlight')}</span>.
          </h1>
          <p className="text-xl text-wool">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Content Columns */}
      <section className="py-24 px-6 lg:px-12 bg-navy">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{t('storyTitle')}</h2>
            <div className="space-y-4 text-wool text-lg leading-relaxed">
              <p>
                {t('storyP1')}
              </p>
              <p>
                {t('storyP2')}
              </p>
              <p>
                {t('storyP3')}
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
          <h2 className="text-3xl font-bold mb-12 text-center">{t('valuesTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('values.integrity.title'), desc: t('values.integrity.desc') },
              { title: t('values.quality.title'), desc: t('values.quality.desc') },
              { title: t('values.innovation.title'), desc: t('values.innovation.desc') }
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
