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

  // Mobile variant - full list
  if (variant === "mobile") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Globe className="h-4 w-4" />
          <span>Language</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                "flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                locale === loc
                  ? "bg-copper text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {localeNames[loc]}
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
          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          isOpen && "bg-muted/50"
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
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95">
          <ul role="listbox" className="py-1">
            {locales.map((loc) => (
              <li key={loc}>
                <button
                  onClick={() => handleLocaleChange(loc)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    locale === loc
                      ? "bg-copper/10 text-copper font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  role="option"
                  aria-selected={locale === loc}
                >
                  <span className="w-6 text-center text-xs text-gray-400 uppercase">
                    {loc}
                  </span>
                  <span>{localeNames[loc]}</span>
                  {locale === loc && (
                    <svg className="ml-auto h-4 w-4 text-copper" fill="currentColor" viewBox="0 0 20 20">
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
