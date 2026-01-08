# Cloudflare Pages Deployment Guide

## The Problem (SOLVED)

Your site was only showing the logo because `export const runtime = "edge";` was set in `app/layout.tsx`. This has been removed.

## Deployment Methods

### Method 1: Git Integration (Easiest - Recommended)

1. **Push your code to GitHub/GitLab**

   ```bash
   git add .
   git commit -m "Fix: Remove edge runtime for Cloudflare compatibility"
   git push
   ```

2. **Configure Cloudflare Pages:**

   - Go to Cloudflare Dashboard → Pages
   - Create new project → Connect to Git
   - Select your repository
   - **Build settings:**
     - Framework preset: `Next.js`
     - Build command: `npm run build`
     - Build output directory: `.next`
     - Node version: `20` (set in Environment Variables: `NODE_VERSION=20`)

3. **Environment Variables (Important!):**
   Add these in Cloudflare Pages settings:

   - `RESEND_API_KEY` = your Resend API key
   - `RESEND_FROM` = your verified sender email
   - `INQUIRY_TO` = email to receive inquiries
   - `NODE_VERSION` = `20`

4. **Deploy:** Click "Save and Deploy"

### Method 2: Wrangler CLI (For Manual Deploys)

1. **Login to Cloudflare:**

   ```bash
   wrangler login
   ```

2. **Build your project:**

   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   wrangler pages deploy .next --project-name=ever-knitting
   ```

## Important Notes

- ✅ Edge Runtime has been removed (was causing the issue)
- ✅ Node.js version is set to 20 via `.node-version` file
- ✅ TypeScript errors have been fixed
- ⚠️ Make sure to set environment variables in Cloudflare dashboard
- ⚠️ The `@cloudflare/next-on-pages` adapter has Windows compatibility issues, use Git integration instead

## Testing Locally

Before deploying, test your build:

```bash
npm run build
npm run start
```

Then visit `http://localhost:3000` to verify everything works.

## Troubleshooting

If the site still only shows the logo after deployment:

1. **Check Cloudflare build logs** for errors
2. **Verify environment variables** are set correctly
3. **Check browser console** for JavaScript errors
4. **Ensure Node version is 20** in Cloudflare settings
5. **Clear Cloudflare cache** and redeploy

## What Changed

### Files Modified:

- `app/layout.tsx` - Removed `export const runtime = "edge";`
- `app/actions/send-inquiry.ts` - Fixed TypeScript error
- `next.config.ts` - Cleaned up for Cloudflare compatibility
- `package.json` - Added Cloudflare build scripts
- `.node-version` - Added to specify Node.js 20
