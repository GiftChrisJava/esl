// ===============================================
// LIB EXPORTS - Central export point for all lib utilities
// ===============================================

// Types
export * from "./types";

// Configuration & Constants
export * from "./config";
export * from "./constants";

// Utilities
export * from "./utils";

// Validation helpers
export * from "./validations";

// Mock data (for development without backend)
export * from "./data";

// Re-export commonly used items for convenience
export { COMPANY_INFO, FEATURE_FLAGS } from "./config";
export {
  ERROR_MESSAGES,
  PRODUCT_CATEGORIES,
  SUCCESS_MESSAGES,
} from "./constants";
export { MOCK_PRODUCTS, MOCK_SERVICES, getFeaturedProducts } from "./data";
export { cn, formatNumber, formatPrice, generateId } from "./utils";
export {
  validateContactForm,
  validateEmail,
  validatePhone,
} from "./validations";

// Type-only exports for commonly used types
export type {
  ApiResponse,
  Client,
  ContactFormData,
  InquiryFormData,
  LoadingState,
  PaginatedResponse,
  Partner,
  Product,
  Project,
  Service,
} from "./types";

export type { OrderStatus, PaymentStatus, ProductCategory } from "./constants";
