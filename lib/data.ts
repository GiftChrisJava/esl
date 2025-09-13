// ===============================================
// MOCK DATA FOR DEVELOPMENT (No backend)
// ===============================================

import type {
  Client,
  LandingSlide,
  Partner,
  Product,
  Project,
  Service,
} from "./types";

// Mock Products Data
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Solar Panel 400W Monocrystalline",
    slug: "solar-panel-400w-mono",
    category: "solar-panels",
    price: 35000,
    originalPrice: 40000,
    image: "/products.jpg",
    description:
      "High-efficiency 400W monocrystalline solar panel with 25-year warranty. Perfect for residential and commercial installations.",
    features: [
      "400W peak power output",
      "21% efficiency rating",
      "25-year warranty",
      "Weather resistant",
      "Easy installation",
    ],
    specifications: {
      "Peak Power": "400W",
      Efficiency: "21%",
      Voltage: "24V",
      Current: "16.67A",
      Dimensions: "2000x1000x35mm",
      Weight: "22kg",
    },
    inStock: true,
    badge: "Best Seller",
    warranty: "25 years",
    installation: true,
  },
  {
    id: 2,
    name: "Pure Sine Wave Inverter 5000W",
    slug: "pure-sine-wave-inverter-5000w",
    category: "inverters",
    price: 85000,
    image: "/products.jpg",
    description:
      "High-quality pure sine wave inverter with advanced MPPT technology. Ideal for sensitive electronics and appliances.",
    features: [
      "5000W continuous power",
      "Pure sine wave output",
      "MPPT charge controller",
      "LCD display",
      "Remote monitoring",
    ],
    specifications: {
      Power: "5000W",
      "Input Voltage": "48V DC",
      "Output Voltage": "230V AC",
      Efficiency: "95%",
      Display: "LCD with backlight",
    },
    inStock: true,
    warranty: "2 years",
    installation: true,
  },
  {
    id: 3,
    name: "Lithium Battery 200Ah LiFePO4",
    slug: "lithium-battery-200ah-lifepo4",
    category: "batteries",
    price: 120000,
    originalPrice: 135000,
    image: "/products.jpg",
    description:
      "Long-lasting lithium iron phosphate battery with 6000+ cycle life. Safe and reliable energy storage solution.",
    features: [
      "200Ah capacity",
      "6000+ cycle life",
      "Built-in BMS",
      "Fast charging",
      "Maintenance free",
    ],
    specifications: {
      Capacity: "200Ah",
      Voltage: "12.8V",
      Chemistry: "LiFePO4",
      "Cycle Life": "6000+",
      "Operating Temperature": "-20°C to 60°C",
    },
    inStock: true,
    badge: "New",
    warranty: "5 years",
    installation: false,
  },
  {
    id: 4,
    name: "Solar Mounting Rails Kit",
    slug: "solar-mounting-rails-kit",
    category: "mounting-systems",
    price: 15000,
    image: "/products.jpg",
    description:
      "Complete mounting rail system for solar panel installation on various roof types. Includes all necessary hardware.",
    features: [
      "Universal compatibility",
      "Corrosion resistant",
      "Easy installation",
      "All hardware included",
      "Wind load certified",
    ],
    inStock: true,
    warranty: "10 years",
    installation: true,
  },
  {
    id: 5,
    name: "WiFi Solar Monitor System",
    slug: "wifi-solar-monitor-system",
    category: "monitoring",
    price: 25000,
    image: "/products.jpg",
    description:
      "Advanced monitoring system with WiFi connectivity. Track your solar system performance in real-time.",
    features: [
      "Real-time monitoring",
      "WiFi connectivity",
      "Mobile app",
      "Historical data",
      "Email alerts",
    ],
    inStock: true,
    warranty: "3 years",
    installation: true,
  },
  {
    id: 6,
    name: "Complete Solar System 5kW",
    slug: "complete-solar-system-5kw",
    category: "complete-systems",
    price: 450000,
    originalPrice: 500000,
    image: "/products.jpg",
    description:
      "Complete 5kW solar system package including panels, inverter, batteries, and installation.",
    features: [
      "5kW capacity",
      "Complete package",
      "Professional installation",
      "25-year warranty",
      "Maintenance included",
    ],
    inStock: true,
    badge: "Popular",
    warranty: "25 years",
    installation: true,
  },
];

// Mock Services Data
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    slug: "solar-consultation",
    name: "Solar Energy Consultation",
    description:
      "Professional consultation to assess your energy needs and design the perfect solar solution.",
    features: [
      "Site assessment",
      "Energy audit",
      "Custom design",
      "Financial analysis",
      "ROI calculation",
    ],
    pricing_model: "fixed",
    base_price: 5000,
    image_url: "/image 1.jpg",
    is_active: true,
    display_order: 1,
  },
  {
    id: 2,
    slug: "installation-service",
    name: "Solar Installation Service",
    description:
      "Professional installation by certified technicians with warranty coverage.",
    features: [
      "Certified technicians",
      "Quality assurance",
      "Warranty coverage",
      "Safety compliance",
      "Post-installation support",
    ],
    pricing_model: "per_kw",
    base_price: 50000,
    image_url: "/image 2.jpg",
    is_active: true,
    display_order: 2,
  },
  {
    id: 3,
    slug: "maintenance-service",
    name: "System Maintenance",
    description:
      "Regular maintenance to ensure optimal performance and longevity of your solar system.",
    features: [
      "Regular inspections",
      "Performance optimization",
      "Cleaning services",
      "Component replacement",
      "System upgrades",
    ],
    pricing_model: "monthly",
    base_price: 5000,
    image_url: "/image 3.jpg",
    is_active: true,
    display_order: 3,
  },
];

// Mock Projects Data
export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "residential-nairobi-500kw",
    title: "Residential Solar Installation - Nairobi",
    description:
      "Complete 5kW residential solar system installation in Nairobi with battery backup.",
    short_description: "5kW residential system with battery backup",
    image_url: "/image 1.jpg",
    category: "Residential",
    impact: "Reduced electricity bills by 80%",
    year: 2024,
    status: "Completed",
    client_id: "nairobi-residence-001",
    budget: 500000,
    location: "Nairobi, Kenya",
    is_featured: true,
    display_order: 1,
  },
  {
    id: 2,
    slug: "commercial-mombasa-100kw",
    title: "Commercial Solar Plant - Mombasa",
    description:
      "Large-scale commercial solar installation for manufacturing facility in Mombasa.",
    short_description: "100kW commercial solar plant",
    image_url: "/image 2.jpg",
    category: "Commercial",
    impact: "150 tons CO2 saved annually",
    year: 2024,
    status: "Completed",
    client_id: "mombasa-manufacturing-002",
    budget: 8000000,
    location: "Mombasa, Kenya",
    is_featured: true,
    display_order: 2,
  },
  {
    id: 3,
    slug: "rural-electrification-kisumu",
    title: "Rural Electrification Project - Kisumu",
    description:
      "Solar mini-grid system providing electricity to rural community in Kisumu.",
    short_description: "Rural community electrification",
    image_url: "/image 3.jpg",
    category: "Community",
    impact: "500 households connected",
    year: 2023,
    status: "Completed",
    client_id: "kisumu-community-003",
    budget: 2000000,
    location: "Kisumu, Kenya",
    is_featured: true,
    display_order: 3,
  },
];

// Mock Clients Data
export const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    company_name: "Kenya Power & Lighting Company",
    logo_url: "/client.png",
    website: "https://kplc.co.ke",
    industry: "Energy",
    is_featured: true,
    display_order: 1,
  },
  {
    id: 2,
    company_name: "Safaricom PLC",
    logo_url: "/client.png",
    website: "https://safaricom.co.ke",
    industry: "Telecommunications",
    is_featured: true,
    display_order: 2,
  },
  {
    id: 3,
    company_name: "East African Breweries",
    logo_url: "/client.png",
    website: "https://eabl.com",
    industry: "Manufacturing",
    is_featured: true,
    display_order: 3,
  },
  {
    id: 4,
    company_name: "University of Nairobi",
    logo_url: "/client.png",
    website: "https://uonbi.ac.ke",
    industry: "Education",
    is_featured: false,
    display_order: 4,
  },
];

// Mock Partners Data
export const MOCK_PARTNERS: Partner[] = [
  {
    id: 1,
    partner_name: "SolarTech Industries",
    logo_url: "/client.png",
    website: "https://solartech.com",
    partnership_type: "Technology Partner",
    description:
      "Leading solar panel manufacturer providing cutting-edge technology.",
    start_date: "2023-01-15",
    is_active: true,
    is_featured: true,
    display_order: 1,
    contact_info: {
      email: "partnership@solartech.com",
      phone: "+1-555-0123",
      contact_person: "John Smith",
    },
  },
  {
    id: 2,
    partner_name: "Green Finance Bank",
    logo_url: "/client.png",
    website: "https://greenfinance.co.ke",
    partnership_type: "Financial Partner",
    description:
      "Providing flexible financing solutions for solar installations.",
    start_date: "2023-06-01",
    is_active: true,
    is_featured: true,
    display_order: 2,
    contact_info: {
      email: "solar@greenfinance.co.ke",
      phone: "+254-700-123456",
      contact_person: "Mary Wanjiku",
    },
  },
  {
    id: 3,
    partner_name: "Eco Installers Ltd",
    logo_url: "/client.png",
    website: "https://ecoinstallers.co.ke",
    partnership_type: "Installation Partner",
    description: "Certified installation specialists across East Africa.",
    start_date: "2022-03-10",
    is_active: true,
    is_featured: false,
    display_order: 3,
    contact_info: {
      email: "info@ecoinstallers.co.ke",
      phone: "+254-722-987654",
      contact_person: "David Kiprop",
    },
  },
];

// Mock Landing Slides Data
export const MOCK_LANDING_SLIDES: LandingSlide[] = [
  {
    id: 1,
    title: "Power Your Future with Solar Energy",
    subtitle:
      "Clean, renewable energy solutions for homes and businesses across Kenya",
    image_url: "/image 1.jpg",
    button_text: "Get Started",
    button_link: "/products",
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    title: "Professional Solar Installation",
    subtitle: "Expert installation services with 25-year warranty coverage",
    image_url: "/image 2.jpg",
    button_text: "Learn More",
    button_link: "/services",
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    title: "Join the Green Revolution",
    subtitle: "Reduce your carbon footprint while saving on electricity bills",
    image_url: "/image 3.jpg",
    button_text: "Contact Us",
    button_link: "/contact-us",
    display_order: 3,
    is_active: true,
  },
];

// Helper functions for mock data
export function getMockProductById(id: number): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id);
}

export function getMockProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}

export function getMockProductsByCategory(category: string): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.category === category);
}

export function getMockServiceById(id: number): Service | undefined {
  return MOCK_SERVICES.find((service) => service.id === id);
}

export function getMockServiceBySlug(slug: string): Service | undefined {
  return MOCK_SERVICES.find((service) => service.slug === slug);
}

export function getMockProjectById(id: number): Project | undefined {
  return MOCK_PROJECTS.find((project) => project.id === id);
}

export function getMockProjectBySlug(slug: string): Project | undefined {
  return MOCK_PROJECTS.find((project) => project.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.badge);
}

export function getFeaturedProjects(): Project[] {
  return MOCK_PROJECTS.filter((project) => project.is_featured);
}

export function getFeaturedClients(): Client[] {
  return MOCK_CLIENTS.filter((client) => client.is_featured);
}

export function getFeaturedPartners(): Partner[] {
  return MOCK_PARTNERS.filter((partner) => partner.is_featured);
}

export function getActiveSlides(): LandingSlide[] {
  return MOCK_LANDING_SLIDES.filter((slide) => slide.is_active).sort(
    (a, b) => a.display_order - b.display_order
  );
}
