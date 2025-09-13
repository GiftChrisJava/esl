// ===============================================
// CONSTANTS & CONFIGURATION
// ===============================================

// Product categories
export const PRODUCT_CATEGORIES = [
  "solar-panels",
  "inverters",
  "batteries",
  "mounting-systems",
  "monitoring",
  "accessories",
  "complete-systems",
] as const;

// Order statuses
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
] as const;

// Payment statuses
export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
] as const;

// Tax configuration
export const TAX_RATE = 0.16; // 16% VAT in Kenya
export const FREE_SHIPPING_THRESHOLD = 50000; // KES
export const DEFAULT_SHIPPING_COST = 500; // KES

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/eslkenya",
  twitter: "https://twitter.com/eslkenya",
  linkedin: "https://linkedin.com/company/eslkenya",
  instagram: "https://instagram.com/eslkenya",
  youtube: "https://youtube.com/@eslkenya",
} as const;

// Company contact information
export const CONTACT_INFO = {
  phone: "+254 700 000 000",
  email: "info@eslkenya.com",
  address: "Nairobi, Kenya",
  businessHours: "Mon - Fri: 8:00 AM - 6:00 PM",
  emergencyContact: "+254 700 000 001",
} as const;

// API endpoints (commented out - no backend)
// export const API_ENDPOINTS = {
//   auth: '/api/auth',
//   products: '/api/products',
//   orders: '/api/orders',
//   payments: '/api/payments',
//   contact: '/api/contact'
// } as const;

// Validation rules
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  phone: {
    minLength: 10,
    maxLength: 13,
  },
  email: {
    maxLength: 254,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid phone number",
  passwordTooShort: `Password must be at least ${VALIDATION_RULES.password.minLength} characters`,
  passwordRequirements:
    "Password must contain uppercase, lowercase, and numbers",
  networkError: "Network error. Please check your connection and try again.",
  serverError: "Server error. Please try again later.",
  unauthorized: "You are not authorized to perform this action",
  notFound: "The requested resource was not found",
  validationError: "Please check your input and try again",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  orderPlaced: "Your order has been placed successfully!",
  paymentCompleted: "Payment completed successfully",
  profileUpdated: "Profile updated successfully",
  passwordChanged: "Password changed successfully",
  emailSent: "Email sent successfully",
  dataSaved: "Data saved successfully",
} as const;

// Loading states
export const LOADING_STATES = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
} as const;

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: "#16a34a", // green-600
    secondary: "#0ea5e9", // sky-500
    accent: "#f59e0b", // amber-500
    danger: "#ef4444", // red-500
    warning: "#f59e0b", // amber-500
    success: "#10b981", // emerald-500
    info: "#3b82f6", // blue-500
  },
  fonts: {
    primary: "Inter, sans-serif",
    secondary: "Roboto, sans-serif",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
} as const;

// Feature flags (for development)
export const FEATURE_FLAGS = {
  enablePayments: false, // No backend yet
  enableAuth: false, // No backend yet
  enableRealTimeUpdates: false,
  enableAnalytics: false,
  enableChat: false,
  enableNotifications: false,
  maintenanceMode: false,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  cart: "esl_cart",
  preferences: "esl_preferences",
  theme: "esl_theme",
  language: "esl_language",
  recentlyViewed: "esl_recently_viewed",
} as const;

// Date formats
export const DATE_FORMATS = {
  short: "MMM dd, yyyy",
  long: "MMMM dd, yyyy",
  full: "EEEE, MMMM dd, yyyy",
  time: "HH:mm",
  datetime: "MMM dd, yyyy HH:mm",
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+254|254|0)(7|1)\d{8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const;

// Export type definitions for constants
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type LoadingState = keyof typeof LOADING_STATES;
