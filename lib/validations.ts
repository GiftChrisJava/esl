/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// VALIDATION UTILITIES (No Auth Required)
// ===============================================

import { REGEX_PATTERNS, VALIDATION_RULES } from "./constants";

// Email validation
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  if (email.length > VALIDATION_RULES.email.maxLength) {
    return { isValid: false, error: "Email is too long" };
  }

  if (!REGEX_PATTERNS.email.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

// Phone validation (Kenya format)
export function validatePhone(phone: string): {
  isValid: boolean;
  error?: string;
} {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  const cleanPhone = phone.replace(/\s+/g, "");

  if (cleanPhone.length < VALIDATION_RULES.phone.minLength) {
    return { isValid: false, error: "Phone number is too short" };
  }

  if (cleanPhone.length > VALIDATION_RULES.phone.maxLength) {
    return { isValid: false, error: "Phone number is too long" };
  }

  if (!REGEX_PATTERNS.phone.test(cleanPhone)) {
    return {
      isValid: false,
      error: "Please enter a valid Kenyan phone number",
    };
  }

  return { isValid: true };
}

// Password validation (commented out - no auth)
// export function validatePassword(password: string): { isValid: boolean; error?: string } {
//   if (!password) {
//     return { isValid: false, error: 'Password is required' };
//   }

//   if (password.length < VALIDATION_RULES.password.minLength) {
//     return { isValid: false, error: `Password must be at least ${VALIDATION_RULES.password.minLength} characters` };
//   }

//   if (VALIDATION_RULES.password.requireUppercase && !/[A-Z]/.test(password)) {
//     return { isValid: false, error: 'Password must contain at least one uppercase letter' };
//   }

//   if (VALIDATION_RULES.password.requireLowercase && !/[a-z]/.test(password)) {
//     return { isValid: false, error: 'Password must contain at least one lowercase letter' };
//   }

//   if (VALIDATION_RULES.password.requireNumbers && !/\d/.test(password)) {
//     return { isValid: false, error: 'Password must contain at least one number' };
//   }

//   if (VALIDATION_RULES.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//     return { isValid: false, error: 'Password must contain at least one special character' };
//   }

//   return { isValid: true };
// }

// Name validation
export function validateName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.length < VALIDATION_RULES.name.minLength) {
    return {
      isValid: false,
      error: `Name must be at least ${VALIDATION_RULES.name.minLength} characters`,
    };
  }

  if (name.length > VALIDATION_RULES.name.maxLength) {
    return {
      isValid: false,
      error: `Name must be less than ${VALIDATION_RULES.name.maxLength} characters`,
    };
  }

  return { isValid: true };
}

// Required field validation
export function validateRequired(
  value: string,
  fieldName: string
): { isValid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

// Number validation
export function validateNumber(
  value: string | number,
  min?: number,
  max?: number
): { isValid: boolean; error?: string } {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: "Please enter a valid number" };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Value must be no more than ${max}` };
  }

  return { isValid: true };
}

// Price validation
export function validatePrice(price: string | number): {
  isValid: boolean;
  error?: string;
} {
  const num = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(num)) {
    return { isValid: false, error: "Please enter a valid price" };
  }

  if (num < 0) {
    return { isValid: false, error: "Price cannot be negative" };
  }

  if (num > 10000000) {
    // 10 million KES max
    return { isValid: false, error: "Price is too high" };
  }

  return { isValid: true };
}

// Quantity validation
export function validateQuantity(quantity: string | number): {
  isValid: boolean;
  error?: string;
} {
  const num = typeof quantity === "string" ? parseInt(quantity) : quantity;

  if (isNaN(num) || !Number.isInteger(num)) {
    return { isValid: false, error: "Please enter a valid quantity" };
  }

  if (num < 1) {
    return { isValid: false, error: "Quantity must be at least 1" };
  }

  if (num > 1000) {
    return { isValid: false, error: "Quantity cannot exceed 1000" };
  }

  return { isValid: true };
}

// Form validation helper
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateForm(
  data: Record<string, any>,
  rules: Record<string, string[]>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    for (const rule of fieldRules) {
      let result: { isValid: boolean; error?: string };

      switch (rule) {
        case "required":
          result = validateRequired(value, field);
          break;
        case "email":
          result = validateEmail(value);
          break;
        case "phone":
          result = validatePhone(value);
          break;
        case "name":
          result = validateName(value);
          break;
        case "price":
          result = validatePrice(value);
          break;
        case "quantity":
          result = validateQuantity(value);
          break;
        default:
          result = { isValid: true };
      }

      if (!result.isValid && result.error) {
        errors[field] = result.error;
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Contact form validation
export function validateContactForm(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
}): ValidationResult {
  const rules = {
    name: ["required", "name"],
    email: ["required", "email"],
    phone: ["required", "phone"],
    subject: ["required"],
    message: ["required"],
  };

  return validateForm(data, rules);
}

// Product inquiry form validation
export function validateInquiryForm(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  quantity?: number;
}): ValidationResult {
  const rules: Record<string, string[]> = {
    name: ["required", "name"],
    email: ["required", "email"],
    phone: ["required", "phone"],
    message: ["required"],
  };

  if (data.quantity) {
    rules.quantity = ["quantity"];
  }

  return validateForm(data, rules);
}

// Newsletter subscription validation
export function validateNewsletterForm(data: {
  email: string;
  name?: string;
}): ValidationResult {
  const rules: Record<string, string[]> = {
    email: ["required", "email"],
  };

  if (data.name) {
    rules.name = ["name"];
  }

  return validateForm(data, rules);
}

// File validation
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: "File is required" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "File type not allowed" };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "File size too large" };
  }

  return { isValid: true };
}

// Image validation
export function validateImage(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validateFile(file, allowedTypes, maxSize);
}

// Document validation
export function validateDocument(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validateFile(file, allowedTypes, maxSize);
}

// URL validation
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: "URL is required" };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
}

// Slug validation
export function validateSlug(slug: string): {
  isValid: boolean;
  error?: string;
} {
  if (!slug) {
    return { isValid: false, error: "Slug is required" };
  }

  if (!REGEX_PATTERNS.slug.test(slug)) {
    return {
      isValid: false,
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    };
  }

  return { isValid: true };
}

// Date validation
export function validateDate(date: string | Date): {
  isValid: boolean;
  error?: string;
} {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  return { isValid: true };
}

// Future date validation
export function validateFutureDate(date: string | Date): {
  isValid: boolean;
  error?: string;
} {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) return dateValidation;

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  if (dateObj <= now) {
    return { isValid: false, error: "Date must be in the future" };
  }

  return { isValid: true };
}
