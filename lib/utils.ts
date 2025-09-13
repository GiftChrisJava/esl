/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = "MWK"): string {
  try {
    if (isNaN(price) || price < 0) {
      return `${currency} 0.00`;
    }

    return new Intl.NumberFormat("en-MW", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price).replace("MWK", "MK");
  } catch {
    // Fallback formatting if Intl.NumberFormat fails
    return `MK ${price
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  try {
    return new Intl.NumberFormat("en-MW").format(num);
  } catch {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = "", length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return prefix ? `${prefix}_${result}` : result;
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text to specified length
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Create a slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if phone number is valid (Malawi format)
 */
export function isValidPhone(phone: string): boolean {
  // Malawi phone number formats: +265XXXXXXXXX, 265XXXXXXXXX, 0XXXXXXXXX
  const phoneRegex = /^(\+265|265|0)(99[0-9]|88[0-9]|77[0-9])[0-9]{6}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

/**
 * Format phone number for Malawi
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("+265")) {
    return cleaned;
  } else if (cleaned.startsWith("265")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("0")) {
    return `+265${cleaned.substring(1)}`;
  }

  return phone; // Return original if format not recognized
}

/**
 * Debounce function
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const clonedObj = {} as { [key: string]: any };

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }

    return clonedObj as T;
  }

  return obj;
}

/**
 * Check if object is empty
 */

export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
}

/**
 * Remove undefined values from object
 */

export function removeUndefined<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Get nested object property safely
 */

export function getNestedProperty(
  obj: any,
  path: string,
  defaultValue: any = undefined
): any {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

/**
 * Set nested object property
 */

export function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = path.split(".");
  const lastKey = keys.pop();

  if (!lastKey) return;

  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * Convert file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Convert date to relative time
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;

  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Get order status color classes
 */
export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return targetDate.toLocaleDateString("en-MW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return targetDate.toLocaleString("en-MW", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Generate random color
 */
export function getRandomColor(): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
    return false;
  }
}

/**
 * Download file from URL
 */
export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get URL parameters
 */
export function getUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Update URL without page reload
 */
export function updateUrl(params: Record<string, string | null>): void {
  const url = new URL(window.location.href);

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }

  window.history.replaceState({}, "", url.toString());
}

// ===============================================
// E-COMMERCE UTILITIES (Auth-free versions)
// ===============================================

/**
 * Calculate cart total (without user context)
 */
export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Calculate tax amount
 */
export function calculateTax(subtotal: number, taxRate: number = 0.16): number {
  return subtotal * taxRate;
}

/**
 * Calculate shipping cost (basic logic)
 */
export function calculateShipping(
  subtotal: number,
  shippingRate: number = 500
): number {
  // Free shipping over 50,000 KES
  if (subtotal >= 50000) return 0;
  return shippingRate;
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const prefix = "ESL";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${timestamp}${random}`;
}

/**
 * Validate product data
 */

export function validateProduct(product: any): boolean {
  const required = ["name", "price", "category"];
  return required.every(
    (field) => product[field] !== undefined && product[field] !== null
  );
}

/**
 * Filter products by criteria
 */

export function filterProducts(products: any[], filters: any): any[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.price_min && product.price < filters.price_min) return false;
    if (filters.price_max && product.price > filters.price_max) return false;
    if (filters.in_stock !== undefined && product.inStock !== filters.in_stock)
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = [product.name, product.description, product.category]
        .join(" ")
        .toLowerCase();
      if (!searchFields.includes(searchLower)) return false;
    }
    return true;
  });
}

/**
 * Sort products
 */

export function sortProducts(
  products: any[],
  sortBy: string = "name",
  sortOrder: "asc" | "desc" = "asc"
): any[] {
  return [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
}

/**
 * Search products
 */

export function searchProducts(products: any[], query: string): any[] {
  if (!query.trim()) return products;

  const searchLower = query.toLowerCase();
  return products.filter((product) => {
    const searchFields = [
      product.name,
      product.description,
      product.category,
      ...(product.features || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchFields.includes(searchLower);
  });
}