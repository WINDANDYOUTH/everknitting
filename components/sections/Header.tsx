// components/sections/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Manufacturing", href: "/manufacturing" },
  { name: "Materials", href: "#materials" },
  { name: "Process", href: "#process" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 px-6 lg:px-8",
        isScrolled 
          ? "bg-navy/80 py-3 backdrop-blur-md border-b border-wool/20 shadow-lg" 
          : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-copper flex items-center justify-center text-navy font-bold text-xl transition-transform group-hover:scale-110">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-cashmere">
            EVER KNITTING
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-wool transition-colors hover:text-cashmere"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#contact"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-copper px-6 text-sm font-semibold text-navy transition shadow-[0_0_20px_rgba(184,115,51,0.2)] hover:opacity-90 hover:scale-105 active:scale-95"
          >
            Request a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-cashmere focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-[-1] bg-navy transition-all duration-500 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-semibold text-cashmere hover:text-copper transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-copper py-4 text-lg font-bold text-navy shadow-xl"
          >
            Get a Quote <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
