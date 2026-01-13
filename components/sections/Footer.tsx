// components/sections/Footer.tsx
"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      { name: "What We Manufacture", href: "/manufacturing" },
      { name: "Materials & Yarns", href: "/materials" },
      { name: "Custom Development", href: "/contact" },
      { name: "Quality Control", href: "/process" },
    ],
  },
  {
    title: "Navigation",
    links: [
      { name: "How We Work", href: "/process" },
      { name: "Why Choose Us", href: "/why-us" },
      { name: "FAQ", href: "/faq" },
      { name: "Start Project", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-cashmere border-t border-wool/20">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold tracking-tight">
                EVER KNITTING
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-wool">
                Ever Knitting Company Limited.
                <br />
                Premium knitwear manufacturer specializing in luxury cashmere and 
                high-end blends since 1993.
              </p>
              
              <div className="flex gap-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-wool/30 bg-cashmere/5 transition hover:border-copper hover:text-copper"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="mailto:info@everknitting.com"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-wool/30 bg-cashmere/5 transition hover:border-copper hover:text-copper"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_LINKS.map((group) => (group.title !== "Legal" || true) && (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-cashmere/50 uppercase tracking-wider mb-6">
                  {group.title}
                </h3>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center text-sm text-wool transition hover:text-copper"
                      >
                        {link.name}
                        <ArrowUpRight size={14} className="ml-1 opacity-0 transition group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-cashmere/50 uppercase tracking-wider mb-6">
              Contact Us
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-copper/10 p-2 text-copper">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-cashmere">Factory Address</p>
                  <p className="mt-1 text-xs leading-relaxed text-wool">
                    No. 34, Changlang Road, Changping Town,<br />
                    Dongguan City, Guangdong, China
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-copper/10 p-2 text-copper">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-cashmere">Phone</p>
                  <p className="mt-1 text-xs text-wool">+86 15626260157</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-copper/10 p-2 text-copper">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-cashmere">Inquiries</p>
                  <p className="mt-1 text-xs text-wool">info@everknitting.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 border-t border-wool/20 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-wool/60">
            © {currentYear} Ever Knitting Company Limited. All rights reserved.
          </p>
          <div className="flex gap-8">
            <p className="text-xs text-wool/40 italic">
              Excellence in Knitwear Since 1993
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
