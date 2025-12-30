# Quick Start Guide: Adding New SEO Pages

## For Services

### 1. Open: `app/data/services.ts`

### 2. Add new entry to the `services` object:

```typescript
export const services: Record<string, ServiceData> = {
  // ... existing services

  "your-service-slug": {
    slug: "your-service-slug",
    keyword: "Your Target Keyword",

    // SEO Title (50-60 chars, include keyword + brand)
    title: "Your Service | OEM Manufacturing | Ever Knitting",

    // Meta Description (150-160 chars, include value prop + CTA)
    description:
      "Professional service description with benefits and call-to-action. ISO-certified factory with 15+ years experience.",

    // H1 (Main heading, matches search intent)
    h1: "Professional Service Name for Target Audience",

    // Intro (2-3 sentences, unique value proposition)
    intro:
      "Detailed introduction explaining what makes this service unique, who it's for, and key benefits.",

    // Use Cases (Optional: target audience segments)
    useCases: ["Target audience 1", "Target audience 2", "Target audience 3"],

    // FAQ (Minimum 2-3, answer real customer questions)
    faq: [
      {
        q: "Specific question customers ask about this service?",
        a: "Detailed answer providing real value. Must appear on page exactly as written here.",
      },
      {
        q: "Another common question?",
        a: "Clear, helpful answer with specifics (numbers, timelines, etc.).",
      },
      {
        q: "Third question for FAQ rich results?",
        a: "Complete answer that addresses the question fully.",
      },
    ],
  },
};
```

### 3. Build and test:

```bash
npm run build
```

### 4. Access your new page:

```
http://localhost:3000/services/your-service-slug
```

---

## For Products

### 1. Open: `app/data/products.ts`

### 2. Add new entry:

```typescript
export const products: Record<string, ProductData> = {
  "your-product-slug": {
    slug: "your-product-slug",
    keyword: "Your Product Keyword",
    title: "Your Product | Manufacturing | Ever Knitting",
    description:
      "Product description with materials, features, and call-to-action.",
    h1: "Product Name Manufacturing Services",
    intro: "Unique introduction about this specific product...",

    // Product-specific specifications
    specifications: {
      materials: [
        "Material 1 with details",
        "Material 2 with grade/quality",
        "Material 3 with certifications",
      ],
      gauges: ["7GG", "9GG", "12GG", "14GG"],
      techniques: [
        "Manufacturing technique 1",
        "Manufacturing technique 2",
        "Quality process 3",
      ],
    },

    // Applications
    applications: [
      "Industry/use case 1",
      "Industry/use case 2",
      "Industry/use case 3",
    ],

    // FAQ (same as services)
    faq: [
      { q: "Question?", a: "Answer..." },
      { q: "Question?", a: "Answer..." },
    ],
  },
};
```

---

## For Industries

### 1. Open: `app/data/industries.ts`

### 2. Add new entry:

```typescript
export const industries: Record<string, IndustryData> = {
  "your-industry-slug": {
    slug: "your-industry-slug",
    keyword: "Industry Keyword",
    title: "Solutions for [Industry] | Ever Knitting",
    description:
      "Industry-specific description showing understanding and solutions.",
    h1: "Knitwear Manufacturing for [Industry]",
    intro: "How we serve this specific industry...",

    // Pain points (what challenges they face)
    painPoints: [
      "Common challenge 1 in this industry",
      "Problem 2 specific to this audience",
      "Pain point 3 we can solve",
      "Challenge 4 from their perspective",
    ],

    // Solutions (how we address those pain points)
    solutions: [
      "Our solution to challenge 1",
      "How we solve problem 2",
      "Our approach to pain point 3",
      "Capability that addresses challenge 4",
    ],

    // FAQ (industry-specific questions)
    faq: [
      { q: "Question?", a: "Answer..." },
      { q: "Question?", a: "Answer..." },
    ],
  },
};
```

---

## Content Writing Tips

### Title Tags

✅ **Good**: "Knitwear Manufacturer | OEM & ODM Factory | Ever Knitting"

- Keyword first
- Benefit clear
- Brand included
- 50-60 characters

❌ **Bad**: "Ever Knitting - We Make Sweaters"

- Brand first (waste of prime real estate)
- Vague benefit
- Too short

---

### Meta Descriptions

✅ **Good**: "Professional knitwear manufacturer offering OEM & ODM services for fashion brands. ISO-certified factory with 15+ years experience in cashmere and wool. Request quote today."

- Clear value prop
- Credibility markers (ISO, 15+ years)
- Call to action
- 150-160 characters

❌ **Bad**: "We are a knitwear factory."

- Too short
- No value
- No CTA

---

### FAQ Writing

#### ✅ Good FAQ

```typescript
{
  q: "What is your minimum order quantity for custom sweaters?",
  a: "Our standard MOQ is 100 pieces per style per color. For startups and small brands, we can discuss flexible options for initial sampling and test orders of 50-75 pieces."
}
```

- Specific question customers actually ask
- Complete answer with numbers
- Additional helpful context
- Actionable information

#### ❌ Bad FAQ

```typescript
{
  q: "Do you make sweaters?",
  a: "Yes, we make sweaters."
}
```

- Too generic
- Obvious answer
- No value added
- Won't rank for anything

---

## SEO Validation

After adding new pages, validate:

### 1. Build Successfully

```bash
npm run build
```

Look for: `✓ Generating static pages`

### 2. Check Page Content

- [ ] Title shows in browser tab
- [ ] H1 is visible on page
- [ ] FAQ section displays correctly
- [ ] No broken layouts

### 3. Validate Structured Data

Go to: https://search.google.com/test/rich-results

Enter: `http://localhost:3000/services/your-slug`

Check:

- [ ] Organization schema detected
- [ ] Service/Product schema detected
- [ ] FAQ schema detected
- [ ] No errors or warnings

### 4. Check Metadata

View page source (Ctrl+U), verify:

```html
<title>Your Title | Ever Knitting</title>
<meta name="description" content="Your description..." />
<link rel="canonical" href="https://everknitting.com/services/your-slug" />
```

### 5. Mobile Check

- [ ] Responsive design works
- [ ] Text readable without zooming
- [ ] Buttons easy to tap
- [ ] No horizontal scroll

---

## Common Mistakes to Avoid

### ❌ Duplicate Content

Don't copy-paste and just swap keywords:

```typescript
// BAD
"We are the best knitwear manufacturer";
"We are the best sweater manufacturer";
"We are the best cashmere manufacturer";
```

✅ Write unique value for each:

```typescript
// GOOD
"Knitwear manufacturer with 15+ years OEM/ODM experience";
"Custom sweater manufacturing from design to bulk production";
"Premium cashmere factory using Grade A Mongolian wool";
```

### ❌ Keyword Stuffing

Don't force keywords unnaturally:

```typescript
// BAD
"Knitwear manufacturer China knitwear factory knitwear OEM manufacturer in China for knitwear production knitwear manufacturer services";

// GOOD
"Ever Knitting is a China-based knitwear manufacturer specializing in OEM and ODM production for global fashion brands.";
```

### ❌ Thin Content

Don't create pages that don't add value:

```typescript
// BAD - same content, different keyword
title: "Blue Sweater Manufacturer";
title: "Red Sweater Manufacturer";
title: "Green Sweater Manufacturer";

// GOOD - actually different value
title: "Women's Cashmere Sweater Manufacturer";
title: "Merino Wool Sweater Production";
title: "Corporate Branded Sweater Manufacturing";
```

---

## Need Help?

### Documentation

- Full docs: `SEO_ARCHITECTURE.md`
- Code comments: In each file

### Examples

- Look at existing entries in data files
- Check how questions are written
- See how FAQs provide value

### Schema Validation

- https://search.google.com/test/rich-results
- https://validator.schema.org/

---

**Remember**: Quality over quantity. 10 great pages beat 100 thin pages.
