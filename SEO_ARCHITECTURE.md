# Ever Knitting SEO Infrastructure Documentation

## Overview

This document explains the SEO-focused Next.js architecture for Ever Knitting's programmatic landing pages. The system generates unique, SEO-optimized pages for services, products, and industries while avoiding thin/duplicate content penalties.

---

## 🏗️ Architecture Summary

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Rendering**: Static Site Generation (SSG)
- **TypeScript**: Full type safety
- **SEO**: Native metadata API + JSON-LD schemas
- **No external libraries**: Pure Next.js implementation

### Key Principles

1. **Data-driven**: All content from TypeScript data files
2. **Static generation**: Pre-rendered at build time for speed
3. **Unique content**: Each page has distinct value proposition
4. **Schema validation**: Structured data matches page content
5. **Scalable**: Easy to add new pages without code changes

---

## 📁 Folder Structure

```
ever-knitting/
├── app/
│   ├── data/              # SEO data (single source of truth)
│   │   ├── services.ts    # Service landing page data
│   │   ├── products.ts    # Product landing page data
│   │   └── industries.ts  # Industry landing page data
│   │
│   ├── services/[slug]/
│   │   └── page.tsx       # Dynamic service pages
│   │
│   ├── products/[slug]/
│   │   └── page.tsx       # Dynamic product pages
│   │
│   ├── industries/[slug]/
│   │   └── page.tsx       # Dynamic industry pages
│   │
│   └── layout.tsx         # Root layout with site-wide schemas
│
├── components/
│   └── seo/
│       ├── SeoSchema.tsx  # Reusable JSON-LD component
│       ├── JSONLD.tsx     # Legacy site-wide schemas
│       └── FAQSchema.tsx  # Legacy FAQ schema
│
└── lib/
    ├── seo.ts             # Metadata generation utilities
    └── schema.ts          # JSON-LD schema generators
```

---

## 🎯 How It Works

### 1. Data Files (Single Source of Truth)

**Location**: `app/data/*.ts`

Each data file exports:

- Interface defining the structure
- Record object with all page data
- Utility functions for type-safe access

**Example**: `app/data/services.ts`

```typescript
export interface ServiceData {
  slug: string; // URL identifier
  keyword: string; // Target keyword
  title: string; // SEO title (50-60 chars)
  description: string; // Meta description (150-160 chars)
  h1: string; // Page heading
  intro: string; // Unique value prop
  useCases?: string[]; // Target audiences
  faq: FAQ[]; // Q&A for schema
}

export const services: Record<string, ServiceData> = {
  "knitwear-manufacturer": {
    /* data */
  },
  "custom-sweater-manufacturer": {
    /* data */
  },
};
```

#### Why This Approach?

- ✅ **Centralized content**: Update once, reflects everywhere
- ✅ **Type safety**: Compiler catches missing fields
- ✅ **Easy to scale**: Add new pages by adding data entries
- ✅ **Non-technical friendly**: Can eventually be replaced by CMS

---

### 2. Dynamic Routes with SSG

**Pattern**: `app/[category]/[slug]/page.tsx`

Each dynamic route exports three functions:

#### a) `generateStaticParams()`

Tells Next.js which pages to pre-render at build time.

```typescript
export async function generateStaticParams() {
  return servicesSlugs.map((slug) => ({
    slug,
  }));
}
```

**Result**: All pages are static HTML, not server-rendered.

**SEO Benefits**:

- ⚡ Instant page loads (Core Web Vitals)
- 🤖 Easily crawlable by search engines
- 📦 Cacheable on CDN (Cloudflare, etc.)

---

#### b) `generateMetadata()`

Creates unique SEO metadata for each page.

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  return generateServiceMetadata(service.title, service.description, slug);
}
```

**Generates**:

- `<title>` tag
- `<meta name="description">`
- Canonical URL
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags

**SEO Benefits**:

- 🎯 Unique title/description per page (no duplication)
- 🔗 Canonical URLs prevent duplicate content
- 📱 Optimized for social media sharing

---

#### c) Page Component

Renders the actual page content.

```typescript
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  return (
    <>
      <CombinedSchema schemas={[serviceSchema, faqSchema]} />
      <article>
        <h1>{service.h1}</h1>
        <p>{service.intro}</p>
        {/* FAQ section */}
      </article>
    </>
  );
}
```

**SEO Best Practices**:

- ✅ Semantic HTML (`<article>`, `<header>`, `<section>`)
- ✅ Single `<h1>` per page
- ✅ Structured data matches visible content
- ✅ FAQ section for featured snippets

---

### 3. JSON-LD Structured Data

**Purpose**: Tell Google exactly what your page is about.

**Implementation**: Two-layer approach

#### Layer 1: Site-Wide Schemas (Root Layout)

**File**: `app/layout.tsx`

```typescript
const organizationSchema = generateOrganizationSchema();
const websiteSchema = generateWebsiteSchema();

// Appears on EVERY page
<script type="application/ld+json">
  {JSON.stringify({ "@graph": [organizationSchema, websiteSchema] })}
</script>;
```

**Schemas**:

- **Organization**: Business info, contact details, social links
- **WebSite**: Site name, search functionality

**Google Features Enabled**:

- Knowledge Graph
- Sitelinks search box
- Brand recognition

---

#### Layer 2: Page-Specific Schemas

**Files**: Individual `page.tsx` files

```typescript
const serviceSchema = generateServiceSchema(service, slug);
const faqSchema = generateFAQSchema(service.faq, `/services/${slug}`);

<CombinedSchema schemas={[serviceSchema, faqSchema]} />;
```

**Schema Types by Page**:

- **Services**: `Service` + `FAQPage`
- **Products**: `Product` + `FAQPage`
- **Industries**: `Service` + `FAQPage`

**Google Features Enabled**:

- Rich snippets in search results
- FAQ rich results (expandable Q&A in SERPs)
- Product/Service information panels

---

### 4. SEO Utilities

**File**: `lib/seo.ts`

Helper functions for consistent metadata generation:

```typescript
generateMetadata(config)         // Base metadata generator
generateServiceMetadata(...)     // Service-specific
generateProductMetadata(...)     // Product-specific
generateIndustryMetadata(...)    // Industry-specific
```

**Features**:

- Centralized `BASE_URL` configuration
- Consistent canonical URL format
- Automatic Open Graph generation
- Twitter Card support

**File**: `lib/schema.ts`

JSON-LD schema generators:

```typescript
generateOrganizationSchema(); // Company info
generateWebsiteSchema(); // Site info
generateServiceSchema(data); // Service pages
generateProductSchema(data); // Product pages
generateFAQSchema(faqs); // FAQ sections
generateBreadcrumbSchema(); // Navigation breadcrumbs
```

**Documentation**: Each function includes:

- When to use it
- What Google features it enables
- Required vs. optional fields
- Link to schema.org documentation

---

## 🎨 Page Structure

### Service Pages

```
┌─────────────────────────────────┐
│ <CombinedSchema>                │ → JSON-LD: Service + FAQ
├─────────────────────────────────┤
│ Hero Section                    │ → H1, intro text
├─────────────────────────────────┤
│ Use Cases                       │ → Target audiences
├─────────────────────────────────┤
│ [Shared Components]             │ → Factory info, process, etc.
├─────────────────────────────────┤
│ FAQ Section                     │ → Must match FAQ schema
├─────────────────────────────────┤
│ CTA Section                     │ → Contact/quote request
└─────────────────────────────────┘
```

### Product Pages

```
┌─────────────────────────────────┐
│ <CombinedSchema>                │ → JSON-LD: Product + FAQ
├─────────────────────────────────┤
│ Hero Section                    │ → H1, intro text
├─────────────────────────────────┤
│ Specifications                  │ → Materials, gauges, techniques
├─────────────────────────────────┤
│ Applications                    │ → Use cases
├─────────────────────────────────┤
│ FAQ Section                     │ → Must match FAQ schema
├─────────────────────────────────┤
│ CTA Section                     │ → Get quote
└─────────────────────────────────┘
```

### Industry Pages

```
┌─────────────────────────────────┐
│ <CombinedSchema>                │ → JSON-LD: Service + FAQ
├─────────────────────────────────┤
│ Hero Section                    │ → H1, intro text
├─────────────────────────────────┤
│ Pain Points                     │ → Challenges we solve
├─────────────────────────────────┤
│ Solutions                       │ → Our capabilities
├─────────────────────────────────┤
│ Process Overview                │ → How we work together
├─────────────────────────────────┤
│ FAQ Section                     │ → Must match FAQ schema
├─────────────────────────────────┤
│ CTA Section                     │ → Multiple CTAs
└─────────────────────────────────┘
```

---

## ✅ Google SEO Best Practices Implemented

### 1. Unique Content

❌ **Wrong**: Keyword-stuffed templates

```
"We are the best [KEYWORD] in [LOCATION]"
```

✅ **Right**: Unique value propositions

```typescript
"Ever Knitting is a China-based knitwear manufacturer
specializing in OEM and ODM production for global fashion
brands. We handle everything from design consultation to
mass production, with MOQ as low as 100 pieces per style."
```

---

### 2. Avoid Duplicate Content

- Each page has unique title, description, H1
- Content focuses on different aspects (service vs product vs industry)
- FAQ questions are specific to page topic
- Shared components (factory info) are secondary to unique content

---

### 3. Schema Markup Best Practices

#### Critical Requirements:

1. **Schema must match page content**

   - FAQ schema questions must appear on page verbatim
   - Service names in schema must match H1
   - Don't add schema for content not on the page

2. **Use specific types**

   - ✅ `Service`, `Product`, `FAQPage` are specific
   - ❌ `Thing`, `WebPage` are too generic

3. **Include all required properties**

   - Check schema.org documentation for each type
   - Google may ignore incomplete schemas

4. **Validate before deploying**
   - Use [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Test every new page type
   - Fix warnings and errors

---

### 4. Metadata Optimization

#### Title Tags

- **Format**: `[Keyword] | [Benefit] | Ever Knitting`
- **Length**: 50-60 characters
- **Unique**: Every page different
- **Keyword**: Primary keyword near the start

#### Meta Descriptions

- **Format**: [Value prop] + [Credibility] + [CTA]
- **Length**: 150-160 characters
- **Unique**: Every page different
- **Include**: Keywords naturally, not stuffed

Example:

```
"Professional knitwear manufacturer offering OEM & ODM
services for fashion brands. ISO-certified factory with
15+ years experience. Request quote today."
```

---

### 5. URL Structure

- Clean, readable slugs: `/services/knitwear-manufacturer`
- Keywords in URL path
- Lowercase, hyphen-separated
- Matches content hierarchy

---

### 6. Internal Linking

- Shared components link to related pages
- CTA sections link to contact/quote pages
- Breadcrumbs for navigation (can add breadcrumb schema)
- Related services/products sections (to be implemented)

---

## 🚀 How to Add New Pages

### Step 1: Add Data

Edit the appropriate data file:

**app/data/services.ts**

```typescript
export const services: Record<string, ServiceData> = {
  // ... existing services

  "new-service-slug": {
    slug: "new-service-slug",
    keyword: "Target Keyword",
    title: "SEO Title (50-60 chars)",
    description: "Meta description (150-160 chars)",
    h1: "Page Heading",
    intro: "Unique value proposition...",
    useCases: ["Use case 1", "Use case 2"],
    faq: [
      { q: "Question?", a: "Answer..." },
      { q: "Question?", a: "Answer..." },
    ],
  },
};
```

### Step 2: Build & Deploy

```bash
npm run build
```

That's it! The new page will be:

- Generated at `/services/new-service-slug`
- Include all metadata and schemas
- Follows same structure as existing pages
- Automatically included in sitemap (if sitemap.ts is configured)

---

## 🔍 SEO Validation Checklist

Before launch, verify each page type:

### Google Search Console

- [ ] Submit sitemap
- [ ] Request indexing for key pages
- [ ] Monitor coverage report
- [ ] Check mobile usability

### Google Rich Results Test

- [ ] Test all page types
- [ ] Verify Organization schema
- [ ] Verify Service/Product schema
- [ ] Verify FAQ schema
- [ ] Fix all errors and warnings

### PageSpeed Insights

- [ ] Test Core Web Vitals
- [ ] Optimize images
- [ ] Minimize JavaScript
- [ ] Ensure fast FCP/LCP

### Manual Checks

- [ ] Unique title on every page
- [ ] Unique description on every page
- [ ] Single H1 per page
- [ ] FAQ matches schema exactly
- [ ] All internal links work
- [ ] Canonical URLs correct
- [ ] No duplicate content

---

## 🛠️ Technical Configuration

### Environment Variables

**File**: `.env.local`

```bash
NEXT_PUBLIC_BASE_URL=https://everknitting.com
```

Update this for:

- Canonical URLs
- Open Graph URLs
- Schema.org identifiers

### Build Commands

```bash
# Development
npm run dev

# Production build (test before deploy)
npm run build

# Start production server
npm start

# Cloudflare Pages deployment
# - Connect GitHub repo
# - Build command: npm run build
# - Output directory: .next
```

---

## 📈 Expected SEO Benefits

### Short Term (1-3 months)

- ✅ All pages indexed by Google
- ✅ Rich snippets for FAQ sections
- ✅ Brand search results show knowledge panel
- ✅ Internal page authority building

### Medium Term (3-6 months)

- ✅ Ranking for long-tail keywords
- ✅ Featured snippets for some FAQs
- ✅ Increased organic traffic
- ✅ Better click-through rates from rich results

### Long Term (6-12 months)

- ✅ Ranking for competitive keywords
- ✅ Established domain authority
- ✅ Sitelinks in brand searches
- ✅ Steady SEO lead generation

---

## 🔄 Future Enhancements

### Phase 2: Enhanced Features

- [ ] Dynamic sitemap generation
- [ ] Robots.txt configuration
- [ ] Related pages recommendations
- [ ] Blog/resource center integration
- [ ] Multi-language support

### Phase 3: Advanced SEO

- [ ] Article schema for blog posts
- [ ] Video schema for product demos
- [ ] Review/Rating schema (if applicable)
- [ ] HowTo schema for manufacturing processes
- [ ] Case study pages with Project schema

### Phase 4: Conversion Optimization

- [ ] A/B testing framework
- [ ] Lead magnet CTAs
- [ ] Quote request forms
- [ ] Sample request tracking
- [ ] Analytics integration

---

## 📚 Resources

### Official Documentation

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

### Validation Tools

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### SEO Guidelines

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

---

## 🎓 Key Takeaways

1. **Data-driven = Scalable**: Add pages with data, not code
2. **SSG = Speed**: Pre-rendered pages load instantly
3. **Unique content = SEO success**: Avoid templates, create value
4. **Schema = Rich results**: Structured data gets featured
5. **Type safety = Fewer bugs**: TypeScript catches mistakes early

This architecture provides a solid foundation for programmatic SEO that scales from dozens to thousands of pages while maintaining quality and avoiding Google penalties.
