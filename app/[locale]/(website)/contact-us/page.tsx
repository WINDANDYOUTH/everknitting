import React from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { BUSINESS_CONTACT } from "@/lib/contact";
import { ContactForm } from "@/components/sections/ContactForm";
import { setRequestLocale, getTranslations } from 'next-intl/server';

export const runtime = 'edge';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="bg-navy min-h-screen text-cashmere">
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-navy-deep min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s <span className="text-copper">Talk.</span>
          </h1>
          <p className="text-xl text-wool max-w-2xl">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto -mt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-navy p-8 md:p-12 rounded-3xl shadow-2xl border border-wool/10 h-full">
            <h2 className="text-2xl font-bold mb-8">{t('infoTitle')}</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">{t('info.samplingAddress')}</h3>
                  <p className="text-wool mt-1">
                    {BUSINESS_CONTACT.samplingStreet}<br />
                    {BUSINESS_CONTACT.samplingCity}, {BUSINESS_CONTACT.samplingRegion}<br />
                    {BUSINESS_CONTACT.samplingCountry}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">{t('info.emailUs')}</h3>
                  <p className="text-wool mt-1">
                    <a href={BUSINESS_CONTACT.emailHref} className="hover:text-cashmere underline underline-offset-4">{BUSINESS_CONTACT.email}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                 <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">{t('info.callUs')}</h3>
                  <p className="text-wool mt-1">
                    <a href={BUSINESS_CONTACT.phoneHref} className="hover:text-cashmere underline underline-offset-4">{BUSINESS_CONTACT.phone}</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">WhatsApp</h3>
                  <p className="text-wool mt-1">
                    <a href={BUSINESS_CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-cashmere underline underline-offset-4">{BUSINESS_CONTACT.phone}</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-wool/20 pt-6">
              <h3 className="font-semibold text-lg text-cashmere">{t('info.manufacturingTitle')}</h3>
              <p className="text-wool mt-2">{t('info.manufacturingDescription')}</p>
              <p className="mt-4 font-medium text-cashmere">{BUSINESS_CONTACT.manufacturingName}</p>
              <p className="text-wool mt-1">
                {BUSINESS_CONTACT.manufacturingStreet}<br />
                {BUSINESS_CONTACT.manufacturingRegion}<br />
                {BUSINESS_CONTACT.manufacturingCountry}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
