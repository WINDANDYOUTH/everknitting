This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
ever-knitting
├─ .agent
│  └─ ANTI_SPAM_MEASURES.md
├─ app
│  ├─ actions
│  │  └─ send-inquiry.ts
│  ├─ data
│  │  ├─ industries.ts
│  │  ├─ products.ts
│  │  └─ services.ts
│  ├─ emails
│  │  └─ inquiry-email.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ industries
│  │  └─ [slug]
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ layout.tsx
│  ├─ manufacturing
│  │  └─ page.tsx
│  ├─ page.tsx
│  ├─ products
│  │  └─ [slug]
│  │     ├─ generate.ts
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  └─ services
│     └─ [slug]
│        ├─ layout.tsx
│        └─ page.tsx
├─ components
│  ├─ ScrollStack.tsx
│  ├─ sections
│  │  ├─ FAQSection.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Header.tsx
│  │  ├─ HeroSection.tsx
│  │  ├─ HowWeWork.tsx
│  │  ├─ ManufacturingHero.tsx
│  │  ├─ ManufacturingSection.tsx
│  │  ├─ MaterialsSection.tsx
│  │  ├─ MobileMaterialsStack.tsx
│  │  ├─ StartYourProjectSection.tsx
│  │  ├─ WhatWeManufactureSection.tsx
│  │  └─ WhyEverKnittingSection.tsx
│  ├─ seo
│  │  ├─ FAQSchema.tsx
│  │  ├─ JSONLD.tsx
│  │  └─ SeoSchema.tsx
│  └─ ui
│     └─ rainbow-button.tsx
├─ components.json
├─ eslint.config.mjs
├─ lib
│  ├─ schema.ts
│  ├─ seo.ts
│  └─ utils.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo.png
│  ├─ logo.svg
│  ├─ manufacturing
│  │  ├─ knitting-machine.png
│  │  ├─ quality-control.png
│  │  └─ yarn-cones.png
│  ├─ next.svg
│  ├─ products
│  │  ├─ alpaca-mohair.png
│  │  ├─ custom-development.png
│  │  ├─ luxury-cashmere-crewneck-sweater.png
│  │  ├─ mens-knitwear.png
│  │  ├─ womens-knitwear.png
│  │  └─ wool-blend.png
│  ├─ vercel.svg
│  └─ window.svg
├─ QUICK_START.md
├─ README.md
├─ SEO_ARCHITECTURE.md
├─ SEO_SUMMARY.md
├─ tailwind.config.ts
└─ tsconfig.json

```