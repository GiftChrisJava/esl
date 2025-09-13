// ===============================================
// COMPANY CONFIGURATION
// ===============================================

export const COMPANY_INFO = {
  name: "Energy Solutions Limited",
  shortName: "ESL",
  tagline: "Powering Tomorrow, Today",
  description: "Leading provider of renewable energy solutions in Uganda",

  // Contact Information
  email: "info@energysolutionsltd.com",
  phone: "+256 700 123 456",
  whatsapp: "+256 700 123 456",

  // Address
  address: {
    street: "Plot 123, Industrial Area",
    city: "Kampala",
    country: "Uganda",
    postalCode: "P.O. Box 12345",
  },

  // Social Media
  social: {
    facebook: "https://facebook.com/energysolutionsltd",
    twitter: "https://twitter.com/energysolutionsltd",
    linkedin: "https://linkedin.com/company/energysolutionsltd",
    instagram: "https://instagram.com/energysolutionsltd",
  },

  // Business Details
  registration: "12345678",
  taxId: "1000123456",

  // Operating Hours
  hours: {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed",
  },
};

// ===============================================
// FEATURE FLAGS
// ===============================================

export const FEATURE_FLAGS = {
  // E-commerce features
  ecommerceEnabled: false, // Disabled for now as requested
  onlinePayments: false,
  cartEnabled: false,
  checkoutEnabled: false,

  // Authentication features
  authEnabled: false, // Disabled as requested
  userRegistration: false,
  userProfiles: false,

  // Content features
  blogEnabled: true,
  testimonialsEnabled: true,
  projectShowcaseEnabled: true,

  // Contact features
  contactFormEnabled: true,
  whatsappIntegration: true,
  emailInquiries: true,

  // Admin features
  adminPanelEnabled: true,
  userManagement: false, // Disabled for now
  contentManagement: true,

  // Third-party integrations
  googleAnalytics: false,
  facebookPixel: false,
  liveChatEnabled: false,
};

// ===============================================
// APPLICATION CONFIGURATION
// ===============================================

export const APP_CONFIG = {
  // Site metadata
  siteName: COMPANY_INFO.name,
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  siteDescription: COMPANY_INFO.description,

  // SEO
  defaultOgImage: "/og-image.jpg",
  twitterHandle: "@energysolutionsltd",

  // Pagination
  itemsPerPage: 12,
  projectsPerPage: 9,
  testimonialsPerPage: 6,

  // Image settings
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],

  // Currency
  currency: {
    code: "UGX",
    symbol: "UGX",
    locale: "en-UG",
  },
};

// ===============================================
// NAVIGATION CONFIGURATION
// ===============================================

export const NAVIGATION = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about-us" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Partners", href: "/partnerships" },
    { name: "Contact", href: "/contact-us" },
  ],

  footer: {
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Our Team", href: "/about-us#team" },
      { name: "Careers", href: "/careers" },
      { name: "News", href: "/news" },
    ],
    services: [
      { name: "Solar Installation", href: "/services/solar-installation" },
      { name: "System Maintenance", href: "/services/maintenance" },
      { name: "Consultation", href: "/services/consultation" },
      { name: "Training", href: "/services/training" },
    ],
    support: [
      { name: "Contact Us", href: "/contact-us" },
      { name: "Documentation", href: "/docs" },
      { name: "FAQs", href: "/faqs" },
      { name: "Support Center", href: "/support" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Warranty", href: "/warranty" },
      { name: "Returns", href: "/returns" },
    ],
  },
};
