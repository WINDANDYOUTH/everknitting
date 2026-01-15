import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Define routes that require authentication (with locale prefix)
const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/dashboard(.*)',
]);

// Define routes that should skip i18n (API routes, static files, etc.)
const isApiRoute = createRouteMatcher([
  '/api(.*)',
  '/trpc(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Skip i18n for API routes
  if (isApiRoute(req)) {
    return;
  }

  // Check authentication for protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
