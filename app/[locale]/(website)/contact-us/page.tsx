import React from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
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

  return (
    <div className="bg-navy min-h-screen text-cashmere">
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-navy-deep min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s <span className="text-copper">Talk.</span>
          </h1>
          <p className="text-xl text-wool max-w-2xl">
            Whether you are an established brand looking for a new partner or a startup launching your first collection, we are here to help.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto -mt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-navy p-8 md:p-12 rounded-3xl shadow-2xl border border-wool/10 h-full">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">Factory Address</h3>
                  <p className="text-wool mt-1">
                    No. 123 Textile Road, Dalang Town<br />
                    Dongguan City, Guangdong Province<br />
                    China
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">Email Us</h3>
                  <p className="text-wool mt-1">
                    inquiries@everknitting.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-navy-deep rounded-lg text-copper">
                 <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-cashmere">Call Us</h3>
                  <p className="text-wool mt-1">
                    +86 769 1234 5678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
