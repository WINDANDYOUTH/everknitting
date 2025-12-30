/**
 * SEO DATA: Products
 * 
 * Product landing pages targeting specific knitwear product keywords.
 * Each product page is unique with specific material, construction, and use case details.
 * 
 * Structure is similar to services but focused on product-specific attributes.
 */

export interface ProductData {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  specifications?: {
    materials: string[];
    gauges: string[];
    techniques: string[];
  };
  applications?: string[];
  faq: Array<{ q: string; a: string }>;
}

export const products: Record<string, ProductData> = {
  "womens-cashmere-sweaters": {
    slug: "womens-cashmere-sweaters",
    keyword: "Women's Cashmere Sweaters",
    title: "Women's Cashmere Sweaters Manufacturer | OEM Factory | Ever Knitting",
    description:
      "Manufacture premium women's cashmere sweaters: crew neck, V-neck, turtleneck, cardigan styles. 12GG-18GG available. Grade A Mongolian cashmere. MOQ 100pcs.",
    h1: "Women's Cashmere Sweaters: OEM Manufacturing Services",
    intro:
      "Ever Knitting manufactures high-quality women's cashmere sweaters for fashion brands and retailers. We offer full customization in styles, colors, and sizing with rigorous quality control standards.",
    specifications: {
      materials: [
        "100% Mongolian Cashmere (Grade A, 15.5-16μ)",
        "Cashmere/Silk Blend (70/30, 85/15)",
        "Cashmere/Cotton Blend",
      ],
      gauges: ["12GG", "14GG", "16GG", "18GG"],
      techniques: [
        "Fully-fashioned knitting",
        "Seamless construction",
        "Hand-linked shoulders",
        "Intarsia patterns",
        "Cable knitting",
      ],
    },
    applications: [
      "Luxury fashion brands",
      "Premium e-commerce retailers",
      "Corporate gift programs",
      "Hotel and spa amenities",
    ],
    faq: [
      {
        q: "What styles of women's cashmere sweaters can you manufacture?",
        a: "We manufacture crew neck, V-neck, turtleneck, cowl neck, off-shoulder, and cardigan styles. All styles can be customized with different sleeve lengths, hem styles, and neckline variations.",
      },
      {
        q: "What is the sizing range for women's cashmere sweaters?",
        a: "Our standard sizing ranges from XS to XXL. We also offer custom sizing and grading based on your brand's size chart. Extended sizes are available for additional markets.",
      },
      {
        q: "How do you ensure color consistency across production batches?",
        a: "We use Pantone color matching with approved lab dips before bulk production. Each dye lot is tested for colorfastness and consistency. We maintain dye recipes for reorders to ensure exact matching.",
      },
    ],
  },

  "merino-wool-sweaters": {
    slug: "merino-wool-sweaters",
    keyword: "Merino Wool Sweaters",
    title: "Merino Wool Sweater Manufacturer | Fine & Extra Fine Wool | Ever Knitting",
    description:
      "Merino wool sweater production in fine (19.5μ) and extra fine (17.5μ) grades. Sustainable Australia wool. Breathable, soft, machine washable. OEM & ODM available.",
    h1: "Merino Wool Sweater Manufacturing: Sustainable & Performance Knits",
    intro:
      "We specialize in merino wool sweater manufacturing using Australian and New Zealand fine merino wool. Our sweaters are designed for performance, comfort, and sustainability with certifications available.",
    specifications: {
      materials: [
        "Extra Fine Merino (17.5μ)",
        "Fine Merino (19.5μ)",
        "Merino/Nylon Blend (for durability)",
        "Organic Merino (GOTS certified available)",
      ],
      gauges: ["7GG", "9GG", "12GG", "14GG"],
      techniques: [
        "Flatlock seaming",
        "Seamless circular knitting",
        "Jacquard patterns",
        "Pointelle detailing",
      ],
    },
    applications: [
      "Activewear brands",
      "Outdoor apparel companies",
      "Sustainable fashion labels",
      "Performance workwear",
    ],
    faq: [
      {
        q: "Is merino wool really machine washable?",
        a: "Yes, our merino wool sweaters undergo a special finishing process called Superwash treatment, making them machine washable without shrinkage. Care labels and washing instructions are provided.",
      },
      {
        q: "Do you offer sustainable or organic merino wool options?",
        a: "Yes, we source organic merino wool from GOTS-certified suppliers and can provide ZQ Merino certification for ethically raised sheep. These options ensure animal welfare and environmental standards.",
      },
      {
        q: "What's the difference between fine and extra fine merino wool?",
        a: "Extra fine merino (17.5 microns) is softer and more luxurious, ideal for base layers and premium sweaters. Fine merino (19.5 microns) is more durable and affordable, perfect for outerwear and everyday sweaters.",
      },
    ],
  },

  "cotton-knit-sweaters": {
    slug: "cotton-knit-sweaters",
    keyword: "Cotton Knit Sweaters",
    title: "Cotton Knit Sweater Manufacturer | Pima & Organic Cotton | Ever Knitting",
    description:
      "Cotton sweater manufacturer: Pima, Supima, Egyptian, organic cotton. Lightweight spring/summer knits. GOTS certified organic available. Great for sustainable brands.",
    h1: "Cotton Knit Sweater Manufacturing: Breathable & Sustainable Options",
    intro:
      "Our cotton knit sweaters are perfect for spring/summer collections and year-round layering. We use premium cotton varieties including Pima, Supima, and GOTS-certified organic cotton.",
    specifications: {
      materials: [
        "Pima Cotton (extra-long staple)",
        "Supima Cotton (American-grown)",
        "Organic Cotton (GOTS certified)",
        "Egyptian Cotton",
        "Cotton/Linen Blend",
      ],
      gauges: ["7GG", "9GG", "12GG"],
      techniques: [
        "Open knit structures",
        "Pointelle knitting",
        "Mesh panels",
        "Rib knitting",
      ],
    },
    applications: [
      "Summer fashion collections",
      "Sustainable clothing brands",
      "Beach and resort wear",
      "Athleisure lines",
    ],
    faq: [
      {
        q: "What makes Pima cotton better for sweaters?",
        a: "Pima cotton has extra-long staple fibers (35mm+) which create smoother, stronger yarn with less pilling. It's softer, more durable, and has better color retention than regular cotton.",
      },
      {
        q: "Can you manufacture lightweight cotton sweaters for summer?",
        a: "Yes, we specialize in lightweight cotton knits using fine gauge (12GG) and open knit structures. These sweaters are breathable and perfect for spring/summer collections and warm climates.",
      },
      {
        q: "Do you offer GOTS-certified organic cotton sweaters?",
        a: "Yes, we can source GOTS-certified organic cotton and maintain chain of custody certification. This ensures your products meet strict environmental and social criteria throughout the supply chain.",
      },
    ],
  },

  "pullover-hoodies": {
    slug: "pullover-hoodies",
    keyword: "Pullover Hoodies Manufacturer",
    title: "Pullover Hoodie Manufacturer | Custom Knit Hoodies | Ever Knitting",
    description:
      "Custom knit pullover hoodie manufacturer for streetwear and activewear brands. French terry, fleece, and premium knits. Custom embroidery and printing. MOQ 100.",
    h1: "Pullover Hoodie Manufacturing: Premium Knit Hoodies for Brands",
    intro:
      "We manufacture premium knit pullover hoodies for streetwear, athleisure, and casual fashion brands. All hoodies feature quality construction with reinforced seams, metal-tipped drawstrings, and custom branding options.",
    specifications: {
      materials: [
        "French Terry (Cotton/Poly blend)",
        "Fleece (brushed interior)",
        "100% Cotton Jersey",
        "Recycled Polyester Terry",
      ],
      gauges: ["5GG", "7GG", "9GG"],
      techniques: [
        "Tubular body construction",
        "Set-in sleeves",
        "Kangaroo pocket",
        "Ribbed cuffs and hem",
      ],
    },
    applications: [
      "Streetwear brands",
      "Activewear lines",
      "Corporate merchandise",
      "University and team apparel",
    ],
    faq: [
      {
        q: "Can you add custom embroidery or printing to hoodies?",
        a: "Yes, we offer in-house embroidery, screen printing, and heat transfer services. We can apply logos, graphics, and text to front, back, sleeves, or hood areas. Artwork files should be provided in vector format.",
      },
      {
        q: "What weight options are available for pullover hoodies?",
        a: "We offer lightweight (180-220 GSM) for spring/fall, midweight (260-300 GSM) for everyday wear, and heavyweight (320-400 GSM) for winter collections. Weight can be customized based on your target market.",
      },
      {
        q: "Do you manufacture sustainable or recycled hoodies?",
        a: "Yes, we can manufacture hoodies using recycled polyester from post-consumer PET bottles or organic cotton. We can also provide GRS (Global Recycled Standard) certification for recycled content.",
      },
    ],
  },
};

// Export type-safe keys for routing
export const productSlugs = Object.keys(products);

// Utility to get product by slug
export function getProductBySlug(slug: string): ProductData | undefined {
  return products[slug];
}
