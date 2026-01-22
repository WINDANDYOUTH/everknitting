"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ className, variant = "desktop" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  // Mobile variant - compact grid
  if (variant === "mobile") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Globe className="h-3.5 w-3.5" />
          <span className="font-medium">Language</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                "relative flex items-center justify-center py-2 px-2 rounded-lg text-xs font-semibold transition-all border",
                locale === loc
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-muted text-muted-foreground border-border hover:border-foreground/30 hover:bg-accent active:bg-accent/80"
              )}
            >
              <span className="truncate">{localeNames[loc]}</span>
              {locale === loc && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground rounded-full border border-background flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-background" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop variant - dropdown
  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
          "text-foreground/80 hover:text-foreground hover:bg-accent hover:border-border",
          isOpen ? "bg-accent border-border" : "border-transparent"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-background rounded-xl shadow-xl shadow-black/10 border border-border overflow-hidden z-50 animate-in fade-in-0 zoom-in-95">
          <ul role="listbox" className="py-1.5">
            {locales.map((loc) => (
              <li key={loc}>
                <button
                  onClick={() => handleLocaleChange(loc)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all",
                    locale === loc
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  role="option"
                  aria-selected={locale === loc}
                >
                  <span className={cn(
                    "w-6 text-center text-xs uppercase font-medium",
                    locale === loc ? "text-background/80" : "text-muted-foreground"
                  )}>
                    {loc}
                  </span>
                  <span>{localeNames[loc]}</span>
                  {locale === loc && (
                    <svg className="ml-auto h-4 w-4 text-background" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
