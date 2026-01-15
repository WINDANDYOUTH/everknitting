/**
 * I18N ROUTING CONFIGURATION
 * 
 * Defines the routing behavior for internationalized pages.
 */

import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  // All supported locales
  locales,
  
  // Default locale when no locale is detected
  defaultLocale,
  
  // Locale prefix strategy:
  // - 'always': /en/about, /de/about (every URL has locale)
  // - 'as-needed': /about (default), /de/about (non-default)
  // For B2B SEO, 'always' is recommended for clarity
  localePrefix: 'always',

  // Locale detection configuration
  // When enabled (default), the middleware will:
  // 1. Check for a locale cookie (NEXT_LOCALE) from previous visits
  // 2. If no cookie, detect from Accept-Language browser header
  // 3. If detected locale is supported, redirect to that locale
  // 4. Otherwise, redirect to defaultLocale
  localeDetection: true,
});
