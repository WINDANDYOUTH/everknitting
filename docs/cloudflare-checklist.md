# Cloudflare Deployment Checklist

## 1. Environment Variables (Environment Config)

Before deploying, you must set these variables in your **Cloudflare Pages Project Settings** -> **Environment variables**.

| Variable                            | Description                                                         |
| ----------------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key from Clerk Dashboard                                     |
| `CLERK_SECRET_KEY`                  | Secret key from Clerk Dashboard                                     |
| `DATABASE_URL`                      | Supabase Connection String (Transaction/Session Pooler recommended) |
| `DIRECT_URL`                        | Supabase Direct Connection String                                   |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase Project URL                                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase Anon Key                                                   |
| `NODE_VERSION`                      | Set to `20` or latest supported by Cloudflare                       |

## 2. Database Connection (Critical)

Cloudflare Workers/Pages runs on the Edge and cannot run the standard TCP-based Prisma Client engine. You have two options:

### Option A: Prisma Accelerate (Recommended)

This is the easiest way. It routes database queries through an HTTP proxy.

1. Sign up for [Prisma Data Platform](https://console.prisma.io/).
2. Enable "Accelerate" for your project.
3. Replace your `DATABASE_URL` with the `prisma://` URL provided by Accelerate.
4. Update `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
5. Regenerate: `npx prisma generate`

### Option B: Node.js Compatibility Mode

Try to force Node.js compatibility (may be unstable with standard Prisma).
In `wrangler.toml` (if you have one) or Build settings:

- Compatibility flag: `nodejs_compat`

## 3. Build Settings

In Cloudflare Pages Dashboard:

- **Framework Preset**: Next.js
- **Build Command**: `npx @cloudflare/next-on-pages`
- **Output Directory**: `.vercel/output/static`

## 4. Code Adjustments

- Ensure `lib/prisma.ts` handles the `PrismaClient` instantiation correctly (limit hot-reload instances).
- Verify `middleware.ts` is compatible with Edge runtime (Clerk middleware is usually compatible, but check `matcher`).

## 5. Deployment command

Run locally to preview:

```bash
npm run pages:build
npx wrangler pages dev .vercel/output/static
```

If that works, push code to GitHub and let Cloudflare Pages auto-deploy.
