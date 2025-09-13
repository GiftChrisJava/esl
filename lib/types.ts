/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// CORE TYPES
// ===============================================

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  description: string;
  features: string[];
  specifications?: Record<string, string>;
  inStock: boolean;
  badge?: string | null;
  warranty?: string | null;
  installation?: boolean;
}

export interface Service {
  id: number;
  slug: string;
  name: string;
  description: string;
  features: string[];
  pricing_model: string;
  base_price: number;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  category: string;
  impact: string;
  year: number;
  status: string;
  client_id: string;
  budget: number;
  location: string;
  is_featured: boolean;
  display_order: number;
}

export interface Client {
  id: number;
  company_name: string;
  logo_url: string;
  website: string;
  industry: string;
  is_featured: boolean;
  display_order: number;
}

export interface Partner {
  id: number;
  partner_name: string;
  logo_url: string;
  website: string;
  partnership_type: string;
  description: string;
  start_date: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  contact_info: {
    email: string;
    phone: string;
    contact_person: string;
  };
}

export interface LandingSlide {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  button_text?: string | null;
  button_link?: string | null;
  display_order: number;
  is_active: boolean;
}

// ===============================================
// CART & ORDER TYPES (Commented out as auth disabled)
// ===============================================

// export interface CartItem {
//   id: number;
//   product: Product;
//   quantity: number;
//   price: number;
// }

// export interface Order {
//   id: string;
//   order_number: string;
//   customer_id?: string | null;
//   customer_email: string;
//   customer_phone?: string | null;
//   customer_name?: string | null;
//   items: CartItem[];
//   subtotal: number;
//   tax_amount: number;
//   shipping_cost: number;
//   total_amount: number;
//   payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
//   status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed';
//   shipping_address: any;
//   notes?: string | null;
//   payment_reference?: string | null;
//   created_at: string;
//   updated_at: string;
// }

// ===============================================
// USER & AUTH TYPES (Commented out as auth disabled)
// ===============================================

// export interface User {
//   id: string;
//   email: string;
//   full_name?: string | null;
//   phone_number?: string | null;
//   company_name?: string | null;
//   address?: string | null;
//   avatar_url?: string | null;
//   role: 'customer' | 'admin' | 'super_admin';
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// export interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// ===============================================
// FORM TYPES
// ===============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  service_interest?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  quantity?: number;
  product_id?: number;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: string[];
}

// ===============================================
// API RESPONSE TYPES
// ===============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===============================================
// SEO & METADATA TYPES
// ===============================================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

// ===============================================
// UTILITY TYPES
// ===============================================

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface FilterOptions {
  category?: string;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  featured?: boolean;
  search?: string;
  sort_by?: "name" | "price" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// ===============================================
// COMPONENT PROP TYPES
// ===============================================

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
}

// ===============================================
// ADMIN TYPES (For admin panel - separate from user auth)
// ===============================================

export type AdminRole =
  | "system_admin"
  | "web_admin"
  | "sales_admin"
  | "helpdesk_admin";
export type AdminStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "expired";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: AdminRole;
  admin_status: AdminStatus;
  last_login?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AdminLoginInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin?: AdminUser;
  token?: string;
  refresh_token?: string;
  expires_at?: Date;
  requires_password_change?: boolean;
}
