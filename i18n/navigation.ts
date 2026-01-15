/**
 * I18N NAVIGATION
 * 
 * Provides internationalized navigation components.
 * Use these instead of next/link for proper locale handling.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Creates wrapper components that handle locale automatically
export const {
  Link,           // Use instead of next/link
  redirect,       // Use instead of next/navigation redirect
  usePathname,    // Returns pathname without locale prefix
  useRouter,      // Router with locale-aware navigation
  getPathname,    // Get pathname for a specific locale
} = createNavigation(routing);
