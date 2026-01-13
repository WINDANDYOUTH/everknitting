import React from "react";
import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Ever Knitting",
  description: "Get in touch with Ever Knitting for manufacturing inquiries, quotes, or factory visits.",
};

export default function ContactPage() {
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
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-navy">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input type="text" className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" placeholder="Jane" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input type="text" className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input type="email" className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" placeholder="jane@brand.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition h-32 resize-none" placeholder="Tell us about your project..."></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-navy text-white rounded-xl font-bold text-lg hover:bg-copper transition-colors mt-4">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
