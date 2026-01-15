/**
 * ALTERNATE LANGUAGES COMPONENT
 * 
 * Generates hreflang link tags for multilingual SEO.
 * Google uses these to understand language/region variants of pages.
 * 
 * Placement: Should be in the <head> of each page
 * 
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions
 */

import { locales, defaultLocale, Locale } from '@/i18n/config';

interface AlternateLanguagesProps {
  currentPath: string; // Path without locale prefix, e.g., "/about-us"
  baseUrl?: string;
}

/**
 * Maps locale codes to hreflang values
 * hreflang uses ISO 639-1 language codes, optionally with ISO 3166-1 region
 */
const localeToHreflang: Record<Locale, string> = {
  en: 'en',      // English (international)
  de: 'de',      // German
  fr: 'fr',      // French
  es: 'es',      // Spanish
  it: 'it',      // Italian
  // Future:
  // ja: 'ja',   // Japanese
  // ko: 'ko',   // Korean
};

export function AlternateLanguages({ 
  currentPath, 
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everknitting.com' 
}: AlternateLanguagesProps) {
  // Ensure path starts with /
  const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

  return (
    <>
      {/* Generate hreflang for each supported locale */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={localeToHreflang[locale]}
          href={`${baseUrl}/${locale}${normalizedPath}`}
        />
      ))}
      
      {/* x-default for language selection page or default */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/${defaultLocale}${normalizedPath}`}
      />
    </>
  );
}

/**
 * Generate alternate language metadata for Next.js generateMetadata
 * Use this in page-level generateMetadata functions
 */
export function generateAlternateLanguages(
  currentPath: string,
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://everknitting.com'
): Record<string, string> {
  const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  
  const languages: Record<string, string> = {};
  
  locales.forEach((locale) => {
    languages[localeToHreflang[locale]] = `${baseUrl}/${locale}${normalizedPath}`;
  });
  
  // x-default
  languages['x-default'] = `${baseUrl}/${defaultLocale}${normalizedPath}`;
  
  return languages;
}

export default AlternateLanguages;
