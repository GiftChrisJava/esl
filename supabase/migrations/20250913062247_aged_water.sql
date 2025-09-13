/*
# Row Level Security Policies

## Security Overview
- Customers can only access their own data
- Admins have role-based access to relevant data
- Public data (products, services, projects) is readable by all
- Write operations require appropriate permissions

## Policies Created
1. **Public Access**: Products, services, projects (read-only)
2. **Customer Access**: Own profile, cart, orders
3. **Admin Access**: Role-based CRUD operations
4. **System Admin**: Full access to user management
*/

-- ===============================================
-- PROFILES POLICIES
-- ===============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Admins can read all profiles based on role
CREATE POLICY "Admins can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'helpdesk')
    )
  );

-- System admins can update user roles
CREATE POLICY "System admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'system_admin'
    )
  );

-- ===============================================
-- PRODUCT POLICIES
-- ===============================================

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can read active products and categories
CREATE POLICY "Anyone can read active product categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Sales admins and web admins can manage products
CREATE POLICY "Sales admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin')
    )
  );

CREATE POLICY "Sales admins can manage categories"
  ON product_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin')
    )
  );

-- ===============================================
-- CART POLICIES
-- ===============================================

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own cart
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================================
-- ORDER POLICIES
-- ===============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Sales admins can read and update all orders
CREATE POLICY "Sales admins can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin')
    )
  );

-- Order items policies
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Sales admins can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin')
    )
  );

-- Payment transaction policies
CREATE POLICY "Users can read own payment transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payment_transactions.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Sales admins can manage payment transactions"
  ON payment_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin')
    )
  );

-- ===============================================
-- CONTENT MANAGEMENT POLICIES
-- ===============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Everyone can read active content
CREATE POLICY "Anyone can read active services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read active projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read active staff"
  ON staff_members FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read active testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Web admins can manage content
CREATE POLICY "Web admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

CREATE POLICY "Web admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

CREATE POLICY "Web admins can manage staff"
  ON staff_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

CREATE POLICY "Web admins can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

-- ===============================================
-- COMMUNICATION POLICIES
-- ===============================================

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can create contact submissions
CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can create product inquiries"
  ON product_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Helpdesk and system admins can read and manage submissions
CREATE POLICY "Helpdesk can manage contact submissions"
  ON contact_submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'helpdesk')
    )
  );

CREATE POLICY "Helpdesk can manage product inquiries"
  ON product_inquiries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'helpdesk')
    )
  );

-- ===============================================
-- ANALYTICS POLICIES
-- ===============================================

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can create analytics events
CREATE POLICY "Anyone can create analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can read analytics
CREATE POLICY "Admins can read analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'web_admin')
    )
  );