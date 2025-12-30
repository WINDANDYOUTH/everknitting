/**
 * SEO DATA: Industries
 * 
 * Industry-specific landing pages targeting B2B decision makers in different sectors.
 * Each page demonstrates domain expertise and specific use cases for that industry.
 */

export interface IndustryData {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  painPoints?: string[];
  solutions?: string[];
  faq: Array<{ q: string; a: string }>;
}

export const industries: Record<string, IndustryData> = {
  "fashion-brands": {
    slug: "fashion-brands",
    keyword: "Knitwear for Fashion Brands",
    title: "Knitwear Manufacturing for Fashion Brands | OEM Partner | Ever Knitting",
    description:
      "Partner with Ever Knitting for your fashion brand's knitwear production. Design support, sample development, and scalable manufacturing. Serve 100+ global brands.",
    h1: "Knitwear Manufacturing Partner for Fashion Brands",
    intro:
      "Ever Knitting supports fashion brands of all sizes with flexible OEM/ODM knitwear manufacturing. From emerging designers to established labels, we provide design expertise, quality production, and reliable delivery.",
    painPoints: [
      "High MOQs from traditional manufacturers limiting creativity",
      "Quality inconsistency across production batches",
      "Long lead times missing fashion season windows",
      "Lack of design support for technical specifications",
    ],
    solutions: [
      "Flexible MOQ starting at 100 pieces per style",
      "In-house QC team with AQL 2.5 standard inspection",
      "Express production lane for seasonal collections",
      "Free tech pack review and design consultation",
    ],
    faq: [
      {
        q: "What is your experience working with fashion brands?",
        a: "We've partnered with over 100 fashion brands across US, Europe, and Asia for 15+ years. Our clients range from emerging designers to established contemporary labels with retail presence in major department stores.",
      },
      {
        q: "Can you handle small batch production for new fashion brands?",
        a: "Yes, we understand emerging brands need flexibility. Our MOQ is 100 pieces per style, and we offer sampling packages starting at 5-10 pieces for collection development and photoshoots.",
      },
      {
        q: "Do you offer design and technical support for fashion brands?",
        a: "Absolutely. Our design team can review your sketches, create technical specifications, recommend suitable yarns and constructions, and develop samples. This service is complimentary for production orders.",
      },
    ],
  },

  "wholesale-retailers": {
    slug: "wholesale-retailers",
    keyword: "Knitwear for Wholesale",
    title: "Wholesale Knitwear Manufacturer | Bulk Sweater Production | Ever Knitting",
    description:
      "Wholesale knitwear manufacturer offering bulk sweater production with consistent quality. Private label services available. Ship globally. Volume discounts for large orders.",
    h1: "Wholesale Knitwear Manufacturing for Retailers & Distributors",
    intro:
      "Supply your retail channels with high-quality knitwear from our wholesale manufacturing facility. We offer private label services, custom packaging, and volume pricing for wholesalers and distributors.",
    painPoints: [
      "Inconsistent sizing and quality across orders",
      "Limited style options from current suppliers",
      "Complex import/export logistics and customs issues",
      "Difficulty scaling orders during peak seasons",
    ],
    solutions: [
      "Standardized grading and measurement protocols",
      "150+ existing styles catalog plus custom development",
      "Experienced export team handling shipping and documentation",
      "Reserved capacity agreements for peak season planning",
    ],
    faq: [
      {
        q: "What are your wholesale pricing tiers?",
        a: "Pricing varies by material, complexity, and order volume. Generally, orders over 500 pieces receive 8-12% discount, over 1000 pieces receive 15-20% discount. Request a quote for specific pricing on your styles.",
      },
      {
        q: "Do you offer private label knitwear services?",
        a: "Yes, we provide complete private label services including custom labels, hangtags, packaging, and poly bags. We can also create custom sizes and fits based on your customer demographics.",
      },
      {
        q: "What is the reorder process for wholesale accounts?",
        a: "Reorders are streamlined with maintained yarn lots, dye formulas, and production records. Lead time for reorders is typically 30-40 days, and you can add or remove colors from existing approved styles.",
      },
    ],
  },

  "ecommerce-brands": {
    slug: "ecommerce-brands",
    keyword: "Knitwear Manufacturer for E-commerce",
    title: "Knitwear Manufacturer for E-commerce Brands | Dropship Ready | Ever Knitting",
    description:
      "E-commerce knitwear manufacturer with low MOQ, fast turnaround, and direct shipping services. Perfect for DTC brands, Amazon sellers, and online boutiques.",
    h1: "Knitwear Manufacturing Solutions for E-commerce Brands",
    intro:
      "Ever Knitting understands the unique needs of e-commerce brands: fast trends, low initial inventory, and quality photography. We offer e-commerce-optimized manufacturing with flexible ordering and fulfillment support.",
    painPoints: [
      "High upfront inventory investment risking cash flow",
      "Slow response to trending styles and customer feedback",
      "Product photography and content creation expenses",
      "Returns due to sizing or quality issues",
    ],
    solutions: [
      "Low MOQ (100 pieces) to test styles before scaling",
      "30-day express production for trend-based collections",
      "Sample provision for content creation and photoshoots",
      "Detailed measurement charts to reduce return rates",
    ],
    faq: [
      {
        q: "Can you support drop-shipping or fulfillment for e-commerce brands?",
        a: "While we don't offer direct drop-shipping, we can ship to your 3PL fulfillment center or prep inventory for Amazon FBA with proper labeling and packaging per Amazon requirements.",
      },
      {
        q: "How quickly can I get samples for product photography?",
        a: "Sample development takes 10-15 days. We can provide 5-10 sample pieces in different sizes for photography, fit testing, and marketplace listings before committing to bulk production.",
      },
      {
        q: "Do you offer blind drop shipping or custom packaging for e-commerce?",
        a: "We offer custom packaging with your branding (no Ever Knitting branding on products or packaging). Packlist, invoices, and exterior shipping labels can be customized for direct-to-consumer shipping.",
      },
    ],
  },

  "corporate-clients": {
    slug: "corporate-clients",
    keyword: "Corporate Knitwear Manufacturer",
    title: "Corporate Knitwear & Branded Merchandise | Custom Logo Sweaters | Ever Knitting",
    description:
      "Corporate knitwear manufacturer for branded merchandise, employee uniforms, and client gifts. Custom embroidery and packaging. Trusted by Fortune 500 companies.",
    h1: "Corporate Knitwear Manufacturing: Branded Merchandise & Uniforms",
    intro:
      "We manufacture premium corporate knitwear for employee programs, client gifts, and branded merchandise. Every piece can be customized with embroidered or knitted logos, and packaged for professional presentation.",
    painPoints: [
      "Inconsistent quality across large employee orders",
      "Limited customization options for brand identity",
      "Long lead times for seasonal or event-based needs",
      "Difficulty coordinating sizing across diverse workforce",
    ],
    solutions: [
      "Bulk order QC with lot inspection and approval process",
      "Jacquard logo knitting and multi-head embroidery in-house",
      "Priority production lane for corporate deadlines",
      "Comprehensive size runs (XS-3XL+) with fit samples",
    ],
    faq: [
      {
        q: "Can you add our company logo to knitwear products?",
        a: "Yes, we offer embroidery, screen printing, heat transfer, and jacquard knitting for logo placement. Embroidery is most popular for corporate apparel. Provide your logo in vector format for best results.",
      },
      {
        q: "What is the minimum order for corporate branded knitwear?",
        a: "For corporate orders, our MOQ is 100 pieces total across all sizes. However, we can be flexible for executive gifts or special events. Contact us with your specific requirements.",
      },
      {
        q: "Do you offer gift packaging for corporate client gifts?",
        a: "Yes, we provide premium gift packaging including branded boxes, tissue paper, ribbons, and custom inserts. Each piece can be individually packaged or bulk packed based on your distribution needs.",
      },
    ],
  },
};

// Export type-safe keys for routing
export const industrySlugs = Object.keys(industries);

// Utility to get industry by slug
export function getIndustryBySlug(slug: string): IndustryData | undefined {
  return industries[slug];
}
