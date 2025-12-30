/**
 * SEO DATA: Services
 * 
 * Each service entry represents a programmatic landing page targeting specific keywords.
 * All content is unique and value-focused to avoid thin content penalties.
 * 
 * Structure:
 * - slug: URL-friendly identifier for routing
 * - keyword: Primary target keyword (for internal reference)
 * - title: SEO title (50-60 chars, includes brand + keyword)
 * - description: Meta description (150-160 chars, includes CTA)
 * - h1: Page heading (matches search intent)
 * - intro: Unique value proposition (2-3 sentences)
 * - useCases: Target audience segments (optional)
 * - faq: Array of Q&A pairs for FAQ schema (minimum 2-3)
 */

export interface ServiceData {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  useCases?: string[];
  faq: Array<{ q: string; a: string }>;
}

export const services: Record<string, ServiceData> = {
  "knitwear-manufacturer": {
    slug: "knitwear-manufacturer",
    keyword: "Knitwear Manufacturer",
    title: "Knitwear Manufacturer | OEM & ODM Factory in China | Ever Knitting",
    description:
      "Professional knitwear manufacturer offering OEM & ODM services for fashion brands. ISO-certified factory with 15+ years experience in cashmere, wool, and cotton knits.",
    h1: "Professional Knitwear Manufacturer for Fashion Brands",
    intro:
      "Ever Knitting is a China-based knitwear manufacturer specializing in OEM and ODM production for global fashion brands. We handle everything from design consultation to mass production, with MOQ as low as 100 pieces per style.",
    useCases: [
      "Fashion brands seeking OEM manufacturing",
      "Wholesale buyers requiring private label products",
      "Startups launching custom knitwear collections",
    ],
    faq: [
      {
        q: "Are you a direct knitwear manufacturer or a trading company?",
        a: "Ever Knitting is a direct manufacturer with our own factory in Dongguan, China. We handle production in-house with no middlemen, ensuring quality control and competitive pricing.",
      },
      {
        q: "What is your minimum order quantity (MOQ) for knitwear?",
        a: "Our standard MOQ is 100 pieces per style per color. For startups and small brands, we can discuss flexible options for initial sampling and test orders.",
      },
      {
        q: "Do you provide design services for custom knitwear?",
        a: "Yes, we offer full ODM services including design consultation, tech pack development, and sampling. Our in-house designers can help bring your vision to life.",
      },
    ],
  },

  "custom-sweater-manufacturer": {
    slug: "custom-sweater-manufacturer",
    keyword: "Custom Sweater Manufacturer",
    title: "Custom Sweater Manufacturer | OEM Cashmere & Wool Knits | Ever Knitting",
    description:
      "Custom sweater manufacturing for brands: cashmere, merino wool, cotton. Design to delivery in 45-60 days. ISO factory with BSCI certification. Request quote today.",
    h1: "Custom Sweater Manufacturer: From Design to Bulk Production",
    intro:
      "We help fashion brands manufacture custom sweaters from concept to finished product. Specializing in cashmere, merino wool, and premium cotton knits with full customization: yarn, gauge, stitching, and finishing.",
    useCases: [
      "Fashion brands launching seasonal collections",
      "E-commerce stores requiring private label sweaters",
      "Corporate clients needing branded knitwear",
    ],
    faq: [
      {
        q: "What materials can you use for custom sweater manufacturing?",
        a: "We manufacture sweaters in cashmere, merino wool, alpaca, cotton, linen, and blended yarns. All materials are sourced from certified suppliers with quality documentation.",
      },
      {
        q: "How long does it take to manufacture custom sweaters?",
        a: "Sample development takes 10-15 days. After approval, bulk production typically takes 45-60 days depending on order quantity and complexity. Rush orders can be accommodated.",
      },
      {
        q: "Can you match a sweater sample I provide?",
        a: "Yes, we offer sample duplication services. Send us your reference sample and we will analyze the yarn, gauge, construction, and provide exact matching or improved alternatives.",
      },
    ],
  },

  "cashmere-sweater-factory": {
    slug: "cashmere-sweater-factory",
    keyword: "Cashmere Sweater Factory",
    title: "Cashmere Sweater Factory | Premium Mongolian & Chinese Cashmere | Ever Knitting",
    description:
      "Direct cashmere sweater factory in China. 100% Mongolian and Chinese cashmere. 12GG to 18GG knitting. BSCI certified. MOQ 100pcs. Get wholesale pricing now.",
    h1: "Cashmere Sweater Factory: Premium Quality, Factory Direct Pricing",
    intro:
      "Ever Knitting operates a specialized cashmere sweater production facility with advanced computerized knitting machines (12GG, 14GG, 16GG, 18GG). We source Grade A Mongolian and Chinese cashmere for luxury brands and premium retailers.",
    useCases: [
      "Luxury fashion brands requiring premium cashmere",
      "Retailers seeking wholesale cashmere sweaters",
      "Private label brands entering the premium segment",
    ],
    faq: [
      {
        q: "What grade of cashmere do you use?",
        a: "We use Grade A cashmere with fiber diameter of 15.5-16 microns, sourced from Inner Mongolia and certified suppliers. Each batch comes with quality certifications and fiber test reports.",
      },
      {
        q: "Do you offer different cashmere blends?",
        a: "Yes, we offer 100% cashmere, cashmere/silk blends (70/30, 85/15), and cashmere/wool blends. Each blend is optimized for specific use cases balancing luxury, durability, and price point.",
      },
      {
        q: "What certifications does your cashmere factory have?",
        a: "Our factory is BSCI certified, ISO 9001 certified, and complies with REACH regulations. We also provide OEKO-TEX certification upon request for specific orders.",
      },
    ],
  },

  "sweater-oem-odm-service": {
    slug: "sweater-oem-odm-service",
    keyword: "Sweater OEM ODM Service",
    title: "Sweater OEM ODM Service | Full Design to Production | Ever Knitting",
    description:
      "Complete sweater OEM and ODM service: design, sampling, production, QC, shipping. Support tech packs or just concepts. 15+ years serving global brands.",
    h1: "Sweater OEM & ODM Service: Turnkey Manufacturing Solutions",
    intro:
      "Our OEM and ODM services cover the entire sweater production lifecycle. Whether you have complete tech packs or just a concept sketch, we provide design development, sampling, material sourcing, manufacturing, and quality control.",
    useCases: [
      "Brands with existing designs (OEM)",
      "Startups needing design assistance (ODM)",
      "Retailers expanding private label categories",
    ],
    faq: [
      {
        q: "What's the difference between OEM and ODM service?",
        a: "OEM (Original Equipment Manufacturing) means we produce according to your complete designs and specifications. ODM (Original Design Manufacturing) means we help create designs based on your concept, handle tech packs, and manufacture. We offer both.",
      },
      {
        q: "What information do I need to provide for OEM service?",
        a: "For OEM, provide: tech pack with measurements, yarn specifications, stitch patterns, color codes (Pantone), and any reference samples. We can work with AI files, PDFs, or physical samples.",
      },
      {
        q: "How much does ODM design service cost?",
        a: "ODM design and sampling costs vary by complexity. Typically $200-500 per design including 1-2 sample pieces. This fee is refundable/waived when you place a bulk order over 500 pieces.",
      },
    ],
  },
};

// Export type-safe keys for routing
export const servicesSlugs = Object.keys(services);

// Utility to get service by slug
export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services[slug];
}
