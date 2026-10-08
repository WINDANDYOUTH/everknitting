import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

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

// Clerk runs only at the administrative boundary. Public marketing pages do
// not require an identity provider or its development credentials.
const administrativeMiddleware = clerkMiddleware(async (auth, req: NextRequest) => {
  // Skip i18n for API routes
  if (isApiRoute(req)) {
    return;
  }

  // Check authentication for protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
    // CRM lives at /dashboard, outside the localized marketing route group.
    if (req.nextUrl.pathname.startsWith('/dashboard')) return;
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(req);
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // Unsubscribe is intentionally public and is authorized by its opaque token
  // in the Outbound service. Keep it available independently of Clerk.
  if (/^\/api\/outbound\/unsubscribe\/[a-f0-9-]{36}\/?$/.test(pathname)) {
    return NextResponse.next();
  }

  if (!isProtectedRoute(req) && !isApiRoute(req)) {
    return intlMiddleware(req);
  }

  // Missing configuration must never turn administrative routes into public
  // routes. This also prevents automatic development-key provisioning.
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return NextResponse.json(
      { error: 'Administrative authentication is not configured.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return administrativeMiddleware(req, event);
}

export const config = {
  matcher: [
    // Dynamic CRM IDs must remain protected even when they look like assets.
    '/dashboard(.*)',
    '/:locale/dashboard(.*)',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
