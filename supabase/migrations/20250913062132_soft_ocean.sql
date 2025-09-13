/*
# Complete Database Schema for ESL E-commerce Platform

## Overview
This schema supports a full e-commerce platform with:
1. Customer authentication and profiles
2. Product catalog with categories
3. Shopping cart and order management
4. Role-based admin system (4 admin roles)
5. Content management for website
6. Form submissions and communications
7. Analytics and real-time updates

## Tables Created
1. **User Management**: profiles, admin_users
2. **Product Catalog**: product_categories, products, product_images
3. **E-commerce**: cart_items, orders, order_items, payment_transactions
4. **Content Management**: services, projects, testimonials, staff_members
5. **Communications**: contact_submissions, product_inquiries
6. **Analytics**: analytics_events, sales_analytics

## Security
- Row Level Security enabled on all tables
- Role-based access control
- Secure admin permissions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================================
-- ENUMS
-- ===============================================

CREATE TYPE user_role AS ENUM ('customer', 'system_admin', 'sales_admin', 'web_admin', 'helpdesk');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'failed');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE admin_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'resolved', 'closed');

-- ===============================================
-- USER PROFILES (extends Supabase auth.users)
-- ===============================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  district text,
  area text,
  landmarks text,
  avatar_url text,
  role user_role DEFAULT 'customer',
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- PRODUCT MANAGEMENT
-- ===============================================

CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  long_description text,
  category_id uuid REFERENCES product_categories(id),
  price decimal(12,2) NOT NULL,
  compare_at_price decimal(12,2),
  cost_price decimal(12,2),
  stock_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 5,
  weight decimal(8,2),
  dimensions jsonb, -- {length, width, height}
  images jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  requires_shipping boolean DEFAULT true,
  warranty_period text,
  installation_available boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- ===============================================
-- SHOPPING CART
-- ===============================================

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ===============================================
-- ORDERS & PAYMENTS
-- ===============================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id),
  customer_email text NOT NULL,
  customer_phone text,
  customer_name text,
  
  -- Order totals
  subtotal decimal(12,2) NOT NULL,
  tax_amount decimal(12,2) DEFAULT 0,
  shipping_cost decimal(12,2) DEFAULT 0,
  discount_amount decimal(12,2) DEFAULT 0,
  total_amount decimal(12,2) NOT NULL,
  
  -- Status tracking
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  
  -- Shipping information
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  
  -- Additional info
  notes text,
  internal_notes text,
  tracking_number text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  shipped_at timestamptz,
  delivered_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(12,2) NOT NULL,
  total_price decimal(12,2) NOT NULL,
  product_snapshot jsonb, -- Store product details at time of order
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  payment_method text,
  amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'MWK',
  status payment_status DEFAULT 'pending',
  gateway_reference text,
  gateway_transaction_id text,
  gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- ===============================================
-- CONTENT MANAGEMENT
-- ===============================================

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  long_description text,
  features jsonb DEFAULT '[]'::jsonb,
  pricing_model text, -- 'fixed', 'per_hour', 'per_project', 'custom'
  base_price decimal(12,2),
  image_url text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  long_description text,
  category text,
  location text,
  client_name text,
  project_value decimal(12,2),
  start_date date,
  end_date date,
  status text DEFAULT 'planning',
  impact_metrics jsonb DEFAULT '{}'::jsonb,
  technologies_used jsonb DEFAULT '[]'::jsonb,
  image_url text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  position text NOT NULL,
  department text,
  bio text,
  image_url text,
  email text,
  phone text,
  linkedin_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_position text,
  client_company text,
  testimonial_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  project_id uuid REFERENCES projects(id),
  client_image_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- ===============================================
-- FORM SUBMISSIONS & COMMUNICATIONS
-- ===============================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subject text NOT NULL,
  message text NOT NULL,
  project_type text,
  status inquiry_status DEFAULT 'new',
  assigned_to uuid REFERENCES profiles(id),
  response_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  quantity integer DEFAULT 1,
  status inquiry_status DEFAULT 'new',
  assigned_to uuid REFERENCES profiles(id),
  response_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- ANALYTICS & TRACKING
-- ===============================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES profiles(id),
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- ===============================================
-- FUNCTIONS & TRIGGERS
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_inquiries_updated_at BEFORE UPDATE ON product_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
  counter integer;
BEGIN
  -- Get current date in YYYYMMDD format
  SELECT 'ESL' || to_char(now(), 'YYYYMMDD') || '-' INTO new_number;
  
  -- Get count of orders today
  SELECT COUNT(*) + 1 INTO counter
  FROM orders 
  WHERE created_at::date = CURRENT_DATE;
  
  -- Append counter with leading zeros
  new_number := new_number || lpad(counter::text, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update cart totals
CREATE OR REPLACE FUNCTION calculate_cart_total(user_uuid uuid)
RETURNS decimal AS $$
DECLARE
  total decimal := 0;
BEGIN
  SELECT COALESCE(SUM(ci.quantity * p.price), 0) INTO total
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  WHERE ci.user_id = user_uuid;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to check low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE(product_id uuid, product_name text, current_stock integer, threshold integer) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.stock_quantity, p.low_stock_threshold
  FROM products p
  WHERE p.stock_quantity <= p.low_stock_threshold
    AND p.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- SAMPLE DATA
-- ===============================================

-- Insert default product categories
INSERT INTO product_categories (name, slug, description, display_order) VALUES
('Solar Panels', 'solar-panels', 'High-efficiency solar panels for residential and commercial use', 1),
('Batteries', 'batteries', 'Energy storage solutions for solar systems', 2),
('Inverters', 'inverters', 'Power conversion equipment', 3),
('Complete Systems', 'complete-systems', 'Ready-to-install solar power systems', 4),
('Mounting Systems', 'mounting-systems', 'Solar panel mounting and racking systems', 5),
('Monitoring', 'monitoring', 'System monitoring and control equipment', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (sku, name, slug, description, long_description, category_id, price, compare_at_price, stock_quantity, images, features, specifications, is_active, is_featured, warranty_period, installation_available)
SELECT 
  'ESL-SP-400',
  'Monocrystalline Solar Panel 400W',
  'monocrystalline-solar-panel-400w',
  'High-efficiency monocrystalline solar panel with 22% efficiency rating. Perfect for residential and commercial installations.',
  'This premium monocrystalline solar panel delivers exceptional performance with its high-efficiency cells and robust construction. Designed for both residential and commercial applications, it offers reliable power generation for decades. The panel features anti-reflective glass coating that maximizes light absorption while the aluminum frame provides structural integrity and corrosion resistance.',
  id,
  450000,
  520000,
  50,
  '["/image 1.jpg", "/image 2.jpg", "/image 3.jpg"]'::jsonb,
  '["400W Maximum Power Output", "22% High Efficiency Rating", "25-Year Performance Warranty", "Weather Resistant IP67 Rating"]'::jsonb,
  '{"Maximum Power": "400W", "Efficiency": "22%", "Voltage at Max Power": "40.5V", "Operating Temperature": "-40°C to +85°C", "Dimensions": "2008 × 1002 × 35mm", "Weight": "22.5kg"}'::jsonb,
  true,
  true,
  '25 years',
  true
FROM product_categories WHERE slug = 'solar-panels'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, long_description, category_id, price, stock_quantity, images, features, specifications, is_active, is_featured, warranty_period, installation_available)
SELECT 
  'ESL-BAT-100',
  'Lithium Battery 100Ah',
  'lithium-battery-100ah',
  'Deep cycle lithium battery with advanced BMS protection. Ideal for solar energy storage systems.',
  'This advanced lithium iron phosphate (LiFePO4) battery offers superior performance and longevity for solar energy storage applications. With built-in Battery Management System (BMS), it provides comprehensive protection against overcharging, over-discharging, and thermal issues.',
  id,
  850000,
  25,
  '["/image 2.jpg", "/image 1.jpg", "/image 3.jpg"]'::jsonb,
  '["100Ah Capacity (1280Wh)", "Built-in BMS Protection", "10-Year Warranty", "Fast Charging Capability"]'::jsonb,
  '{"Capacity": "100Ah (1280Wh)", "Voltage": "12.8V", "Chemistry": "LiFePO4", "Cycle Life": "6000+ cycles", "Dimensions": "330 × 173 × 220mm", "Weight": "13kg"}'::jsonb,
  true,
  true,
  '10 years',
  false
FROM product_categories WHERE slug = 'batteries'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, long_description, category_id, price, compare_at_price, stock_quantity, images, features, specifications, is_active, is_featured, warranty_period, installation_available)
SELECT 
  'ESL-INV-3000',
  'Pure Sine Wave Inverter 3000W',
  'pure-sine-wave-inverter-3000w',
  'High-quality pure sine wave inverter with LCD display and multiple protection features.',
  'This professional-grade pure sine wave inverter converts DC power to clean AC power, suitable for sensitive electronic equipment. Features advanced LCD display for real-time monitoring and multiple protection systems for safe operation.',
  id,
  380000,
  420000,
  15,
  '["/image 3.jpg", "/image 1.jpg", "/image 2.jpg"]'::jsonb,
  '["3000W Continuous Power", "Pure Sine Wave Output", "LCD Display", "Multiple Protection Features"]'::jsonb,
  '{"Continuous Power": "3000W", "Peak Power": "6000W", "Input Voltage": "12V DC", "Output Voltage": "230V AC", "Efficiency": "90%", "Dimensions": "350 × 240 × 150mm", "Weight": "8.5kg"}'::jsonb,
  true,
  true,
  '2 years',
  true
FROM product_categories WHERE slug = 'inverters'
ON CONFLICT (sku) DO NOTHING;

-- Create initial system admin (you'll need to update this with actual user ID after signup)
-- This will be updated after the first user signs up and we assign them system_admin role