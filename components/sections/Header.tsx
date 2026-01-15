"use client";

import * as React from "react";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackQuotationRequest } from "@/components/analytics";
import { LanguageSwitcher } from "@/components/i18n";
import { useTranslations } from "next-intl";

const NAV_LINKS = [
  { nameKey: "manufacturing", href: "/manufacturing" },
  { nameKey: "materials", href: "/materials" },
  { nameKey: "process", href: "/process" },
  { nameKey: "about", href: "/about-us" },
  { nameKey: "contact", href: "/contact-us" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations("navigation");

  // Handle Resize for isMobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Determine if scrolled for background style
    if (latest > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    // Determine hide/show on scroll
    // Only hide on MOBILE if we have scrolled past a threshold and are scrolling down
    // AND menu is NOT open
    if (isMobile && !mobileMenuOpen && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || mobileMenuOpen
            ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/40"
            : "bg-transparent"
        )}
      >
        <div 
          className={cn(
            "container mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-300",
            scrolled ? "h-[60px] md:h-[70px]" : "h-[72px] md:h-[88px]"
          )}
        >
          {/* Left: Branding */}
          <div className="flex flex-col justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo text for now, assume SVG logo later */}
              <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
                Ever Knitting
              </span>
            </Link>
            <span className={cn(
              "text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide hidden sm:block mt-0.5 transition-opacity duration-300",
              scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100" // Hide tagline on scroll to save space
            )}>
              Cashmere & Knitwear Manufacturer Since 1993
            </span>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-1",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {t(link.nameKey)}
                {pathname === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Language Switcher, CTA & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Switcher (Desktop) */}
            <LanguageSwitcher className="hidden md:block" />

            <Link
              href="/contact-us"
              onClick={() => {
                trackQuotationRequest({
                  source: "header_cta_desktop",
                });
              }}
              className={cn(
                "hidden md:inline-flex items-center justify-center space-x-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6",
                "shadow-lg shadow-primary/20 hover:shadow-primary/30"
              )}
            >
              <span>{t("getQuote")}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-foreground hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay (Right Side Drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            
            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-70 w-[85vw] max-w-xs bg-white text-black shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="text-xl font-bold tracking-tight text-navy-deep">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-navy-deep hover:text-copper transition-colors focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-3 text-lg font-medium transition-colors border-b border-dotted border-gray-100",
                        pathname === link.href ? "text-copper" : "text-gray-900 hover:text-copper"
                      )}
                    >
                      {t(link.nameKey)}
                    </Link>
                  </motion.div>
                ))}

                {/* Language Switcher (Mobile) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + NAV_LINKS.length * 0.05 }}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <LanguageSwitcher variant="mobile" />
                </motion.div>
              </nav>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <Link
                  href="/contact-us"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    trackQuotationRequest({
                      source: "header_cta_mobile",
                    });
                  }}
                  className="w-full flex items-center justify-center rounded-xl bg-navy text-white h-12 text-lg font-semibold shadow-lg hover:bg-navy-deep active:scale-95 transition-all"
                >
                  {t("getQuote")}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
