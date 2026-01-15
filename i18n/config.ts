/**
 * I18N CONFIGURATION
 * 
 * Supported languages for the website.
 * Primary markets: Europe and North America
 * Future markets: Japan and Korea
 */

export const locales = ['en', 'de', 'fr', 'es', 'it'] as const;

// Future languages (uncomment when needed)
// export const locales = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Language display names for the language switcher
export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  // ja: '日本語',
  // ko: '한국어',
};

// Language flags (ISO 3166-1 alpha-2 country codes for flag icons)
export const localeFlags: Record<Locale, string> = {
  en: 'GB', // or 'US' for American English
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  // ja: 'JP',
  // ko: 'KR',
};
