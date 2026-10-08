# Public website development

The public marketing website can render without Clerk, database or email
credentials. It uses local TypeScript data, locale JSON, MDX and image assets.
Clerk remains installed for the private CRM and Outbound administration.

## Run locally or in a cloud development workspace

Use the Node version in `.nvmrc`, then run:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/en`. Other supported locales are `de`, `fr`, `es`
and `it`. No `.env` file is needed to view the public pages. Optional analytics
stay disabled when `NEXT_PUBLIC_GTM_ID` is absent.

For a production-mode check without credentials:

```sh
npm run build
npm run start
```

The build still generates the Prisma client for the separately protected CRM;
it does not create, migrate, read or delete a database.

## Administrative boundary

- `/dashboard` and its child routes still require Clerk authentication.
- Without either `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` or `CLERK_SECRET_KEY`,
  private routes return an uncached 503. They never become public.
- Dashboard layout and each CRM server action also check authentication.
  Prisma is loaded only after the action guard succeeds.
- Real CRM use additionally requires its existing `DATABASE_URL` configuration.
- Outbound retains its Clerk user-ID allowlist, server token, same-origin POST
  check and Cloudflare service binding. Its opaque-token unsubscribe route
  stays public and retains the Worker's existing confirmation/suppression flow.

Configure actual development credentials using the environment's secure secret
controls, never by committing secrets. Do not use production credentials merely
to view public pages.

## Inquiry forms

The site still has server-side inquiry actions; it is not a static-only export.
Forms can be viewed without credentials. Real delivery requires `RESEND_API_KEY`,
`RESEND_FROM` and `INQUIRY_TO`. The displayed business contact email does not
change `INQUIRY_TO`. Do not submit a real inquiry during visual-only QA.

## Boundary tests

```sh
npm run test:boundaries
npm exec -- tsc --noEmit
npm run lint
```

The boundary suite explicitly mocks authentication, Prisma and the Outbound
service. It verifies routing and denial behavior without sending messages or
touching a database. It does not replace signed-in integration tests or
desktop/mobile visual inspection.

## Approved logo placement

The shared `BrandLogo` uses the approved rounded-A, palette-01 artwork:
transparent cocoa in the existing light theme, and the unchanged white reverse
in dark mode. Header width is 180px; footer width is 216px. SVG proportions and
internal clear space are preserved, and each home link has an accessible name.
The unscrolled header reserves 90px from the `sm` breakpoint for its existing
tagline, while the narrow mobile header stays 72px. No page colours are changed.

Run `npm test` for both authentication-boundary and logo source/render tests.
The latter checks accessible image properties, theme selection classes,
dimensions, approved artwork hashes and the relevant sizing breakpoint. These
are component tests, not browser screenshots or interaction tests.
