export interface Package {
  id: "starter" | "business" | "premium";
  name: string;
  price: number;
  priceDisplay: string;
  bestFor: string;
  size: string;
  seo: string;
  geo: boolean;
  logo: string;
  adminDashboard: string;
  includes: string[];
  addons: string[];
}

export const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    price: 7999,
    priceDisplay: "7,999",
    bestFor: "Portfolios, personal brands, freelancers, landing pages",
    size: "1 to 5 sections, single page",
    seo: "Basic on-page",
    geo: false,
    logo: "Extra, from \u20b91,500",
    adminDashboard: "None",
    includes: [
      "Modern responsive UI/UX",
      "Professional typography and icons",
      "Contact form and WhatsApp integration",
      "Basic on-page SEO",
      "HTTPS on supported hosting",
      "3 revision rounds",
    ],
    addons: [
      "Hero banner",
      "About and skills section",
      "Projects gallery",
      "Testimonials or client logos",
      "Social links and resume button",
      "Smooth scroll and subtle animation",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 12999,
    priceDisplay: "12,999",
    bestFor: "Small businesses and growing brands",
    size: "5 to 8 custom pages",
    seo: "On-page + technical",
    geo: true,
    logo: "Extra, from \u20b91,500",
    adminDashboard: "Optional upgrade",
    includes: [
      "5 to 8 custom pages",
      "Consistent branding",
      "On-page and technical SEO foundations",
      "GEO-oriented content structure",
      "Google Maps and WhatsApp integration",
      "Enquiry forms and Search Console setup",
      "HTTPS and baseline secure practices",
      "3 revision rounds",
    ],
    addons: [
      "Individual service or product pages",
      "Testimonials and FAQ",
      "Blog or news",
      "Business hours and location",
      "Click-to-call buttons",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 19999,
    priceDisplay: "19,999",
    bestFor: "Brands wanting a premium, fully branded presence",
    size: "8 to 12 custom pages",
    seo: "Advanced",
    geo: true,
    logo: "Free custom logo",
    adminDashboard: "Basic included",
    includes: [
      "8 to 12 custom pages",
      "Premium UI/UX and advanced interactions",
      "Advanced SEO",
      "GEO structure",
      "Free custom logo",
      "Basic admin dashboard for agreed content",
      "Analytics and Search Console",
      "3 revision rounds and priority communication",
    ],
    addons: [
      "Brand style guide",
      "Blog or case studies with easy editing",
      "Portfolio or catalogue pages",
      "Image and video galleries",
      "Newsletter and lead capture",
      "Defined post-launch support period (agreed in the quotation)",
      "Booking or payment add-ons at menu prices",
    ],
  },
];

export interface Addon {
  name: string;
  price: string;
  category: "design" | "feature" | "seo" | "support" | "content";
}

export const addons: Addon[] = [
  { name: "Professional logo", price: "\u20b91,500", category: "design" },
  { name: "Extra webpage", price: "\u20b91,000", category: "feature" },
  { name: "Admin dashboard upgrade", price: "\u20b94,999+", category: "feature" },
  { name: "Website redesign", price: "\u20b94,999+", category: "feature" },
  { name: "Booking system", price: "\u20b93,999+", category: "feature" },
  { name: "Payment gateway integration", price: "\u20b94,999+", category: "feature" },
  { name: "Monthly SEO growth", price: "\u20b92,999/mo", category: "seo" },
  { name: "Monthly GEO optimisation", price: "\u20b92,499/mo", category: "seo" },
  { name: "Blog/news setup", price: "\u20b92,499", category: "feature" },
  { name: "Photo or product gallery", price: "\u20b91,999", category: "feature" },
  { name: "Multi-language site", price: "\u20b92,999", category: "feature" },
  { name: "Social media launch kit", price: "\u20b91,999", category: "support" },
  { name: "Online store (small catalogue)", price: "\u20b914,999+", category: "feature" },
  { name: "Google Business Profile setup", price: "\u20b91,499", category: "seo" },
  { name: "Business email setup", price: "\u20b9999", category: "support" },
  { name: "Speed and security check-up", price: "\u20b91,999", category: "support" },
  { name: "Content writing", price: "\u20b9500/page", category: "content" },
  { name: "Express delivery", price: "+25%", category: "support" },
];

export interface MaintenancePlan {
  id: string;
  name: string;
  price: string;
  includes: string[];
  note?: string;
}

export const maintenancePlans: MaintenancePlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "\u20b9399/month",
    includes: [
      "Uptime and SSL checks",
      "Supported routine updates",
      "Minor fixes in a defined scope",
    ],
    note: "Does not include unlimited changes.",
  },
  {
    id: "security-performance",
    name: "Security and Performance",
    price: "\u20b91,499+/month",
    includes: [
      "Security and config checks",
      "Backup checks",
      "Dependency updates",
      "Performance checks",
      "Limited support",
    ],
    note: "Hosting and paid security tools charged separately.",
  },
  {
    id: "advanced",
    name: "Advanced Web Application Support",
    price: "Custom quote",
    includes: [
      "Bespoke support scope",
      "Agreed SLA",
      "Priority response",
    ],
  },
];
