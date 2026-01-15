// components/sections/Footer.tsx
"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const FOOTER_LINKS = [
    {
      titleKey: "services",
      links: [
        { nameKey: "links.whatWeManufacture", href: "/manufacturing" },
        { nameKey: "links.materialsYarns", href: "/materials" },
        { nameKey: "links.customDevelopment", href: "/contact-us" },
        { nameKey: "links.qualityControl", href: "/process" },
      ],
    },
    {
      titleKey: "navigation",
      links: [
        { nameKey: "links.howWeWork", href: "/process" },
        { nameKey: "links.whyChooseUs", href: "/about-us" },
        { nameKey: "links.faq", href: "/faq" },
        { nameKey: "links.startProject", href: "/contact-us" },
      ],
    },
    {
      titleKey: "legal",
      links: [
        { nameKey: "privacy", href: "/privacy" },
        { nameKey: "terms", href: "/terms" },
        { nameKey: "cookies", href: "/cookies" },
      ],
    },
  ];

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
                {t("description")}
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
            {FOOTER_LINKS.map((group) => (
              <div key={group.titleKey}>
                <h3 className="text-sm font-semibold text-cashmere/50 uppercase tracking-wider mb-6">
                  {t(group.titleKey)}
                </h3>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.nameKey}>
                      <Link
                        href={link.href}
                        className="group flex items-center text-sm text-wool transition hover:text-copper"
                      >
                        {t(link.nameKey)}
                        <ArrowUpRight size={14} className="ml-1 opacity-0 transition group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-cashmere/50 uppercase tracking-wider mb-6">
              {t("contactUs")}
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-copper/10 p-2 text-copper">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-cashmere">{t("contactInfo.factoryAddress")}</p>
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
                  <p className="text-sm font-medium text-cashmere">{t("contactInfo.phone")}</p>
                  <p className="mt-1 text-xs text-wool">+86 15626260157</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-copper/10 p-2 text-copper">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-cashmere">{t("contactInfo.inquiries")}</p>
                  <p className="mt-1 text-xs text-wool">info@everknitting.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 border-t border-wool/20 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-wool/60">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex gap-8">
            <p className="text-xs text-wool/40 italic">
              {t("tagline")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
