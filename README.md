# Energy Solutions Limited - E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15 and Supabase for Energy Solutions Limited, a renewable energy company in Malawi. The platform features product catalog, shopping cart, secure payments via PayChangu, user authentication, order management, and admin dashboard.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 (App Router), Supabase, PayChangu, Tailwind CSS
- **E-commerce Functionality**: Product catalog, shopping cart, secure checkout
- **Payment Integration**: PayChangu payment gateway with webhook security
- **User Authentication**: Supabase Auth with email/password signup
- **Admin Dashboard**: Role-based access control with comprehensive management tools
- **Real-time Updates**: Live order notifications and inventory tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Fallback System**: Graceful degradation to local storage if backend unavailable

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- A **Supabase account** - [Sign up here](https://supabase.com/)
- A **PayChangu account** - [Sign up here](https://paychangu.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd esl
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# PayChangu Configuration
PAYCHANGU_API_KEY=your_paychangu_api_key
PAYCHANGU_SECRET_KEY=your_paychangu_secret_key
PAYCHANGU_ENCRYPTION_KEY=your_32_character_encryption_key
PAYCHANGU_BASE_URL=https://api.paychangu.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Energy Solutions Limited"
```

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: `energy-solutions-esl`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., Singapore for Africa)
5. Click **"Create new project"**
6. Wait 2-3 minutes for project initialization

### Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and run the contents of `supabase/schema.sql` to create:
   - All database tables
   - Functions and triggers
   - Sequences and enums

3. Copy and run the contents of `supabase/policies.sql` to set up:
   - Row Level Security policies
   - User permissions
   - Data access controls

4. Copy and run the contents of `supabase/storage.sql` to create:
   - Storage buckets for images
   - Storage policies
   - File upload permissions

### Step 4: Configure Authentication

1. In Supabase dashboard, go to **Authentication → Settings**
2. Set **Site URL**: `http://localhost:3000` (development) or your domain (production)
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://yourdomain.com/**` (for production)
4. Enable **Email** authentication
5. Optional: Configure social providers (Google, GitHub, etc.)

## 💳 PayChangu Setup

### Step 1: Get PayChangu Credentials

1. Sign up at [paychangu.com](https://paychangu.com)
2. Complete merchant verification
3. Go to **Developer → API Keys**
4. Copy your credentials to `.env.local`:
   - API Key
   - Secret Key
   - Generate a 32-character encryption key

### Step 2: Configure Webhooks

1. In PayChangu dashboard, go to **Developer → Webhooks**
2. Set webhook URL: `https://yourdomain.com/api/payment/callback`
3. Enable events:
   - Payment Completed
   - Payment Failed
4. Save webhook configuration

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 👨‍💼 Admin Setup

### Create Admin User

1. Start the application: `npm run dev`
2. Register a new user account normally through the frontend
3. Note the user ID from Supabase **Authentication → Users**
4. In Supabase **SQL Editor**, run:

```sql
-- Replace 'user-uuid-here' with actual user ID
UPDATE profiles 
SET role = 'super_admin' 
WHERE id = 'user-uuid-here';
```

5. The user can now access `/admin` with full administrative privileges

### Admin Features

- **Dashboard**: Overview of orders, users, products, revenue
- **Order Management**: View, update, and track all orders
- **Product Management**: Add, edit, delete products and manage inventory
- **User Management**: View user accounts and manage roles
- **Analytics**: Sales reports and business metrics

## 📦 Adding Sample Products

### Option 1: Via Admin Dashboard
1. Login as admin user
2. Go to `/admin`
3. Click "Manage Products"
4. Add products through the interface

### Option 2: Via SQL (Quick Setup)
Run this in Supabase SQL Editor:

```sql
-- Add product categories
INSERT INTO product_categories (name, slug, description) VALUES 
('Solar Panels', 'solar-panels', 'High-efficiency solar panels for residential and commercial use'),
('Batteries', 'batteries', 'Energy storage solutions for solar systems'),
('Inverters', 'inverters', 'Power conversion equipment'),
('Complete Systems', 'complete-systems', 'Ready-to-install solar power systems');

-- Add sample products
INSERT INTO products (sku, name, slug, price, compare_at_price, description, category_id, images, is_active, is_featured)
SELECT 
  'ESL-SP-400',
  'Monocrystalline Solar Panel 400W',
  'monocrystalline-solar-panel-400w',
  450000,
  520000,
  'High-efficiency monocrystalline solar panel with 22% efficiency rating. Perfect for residential and commercial installations.',
  id,
  '["https://via.placeholder.com/400x300/1f2937/ffffff?text=Solar+Panel+400W"]'::jsonb,
  true,
  true
FROM product_categories WHERE slug = 'solar-panels';

INSERT INTO products (sku, name, slug, price, description, category_id, images, is_active, is_featured)
SELECT 
  'ESL-BAT-100',
  'Lithium Battery 100Ah',
  'lithium-battery-100ah',
  850000,
  'Deep cycle lithium battery with advanced BMS protection. Ideal for solar energy storage systems.',
  id,
  '["https://via.placeholder.com/400x300/059669/ffffff?text=Battery+100Ah"]'::jsonb,
  true,
  true
FROM product_categories WHERE slug = 'batteries';

INSERT INTO products (sku, name, slug, price, compare_at_price, description, category_id, images, is_active)
SELECT 
  'ESL-INV-3000',
  'Pure Sine Wave Inverter 3000W',
  'pure-sine-wave-inverter-3000w',
  380000,
  420000,
  'High-quality pure sine wave inverter with LCD display and multiple protection features.',
  id,
  '["https://via.placeholder.com/400x300/dc2626/ffffff?text=Inverter+3000W"]'::jsonb,
  true
FROM product_categories WHERE slug = 'inverters';
```

## 🧪 Testing the Application

### Test User Registration & Login
1. Go to a product page
2. Click "Buy Now"
3. Register a new account
4. Complete the order process

### Test Payment Flow
1. Add products to cart
2. Proceed to checkout
3. Fill in shipping details
4. Use PayChangu test mode for payments

### Test Admin Features
1. Login as admin
2. Check dashboard statistics
3. View and manage orders
4. Add/edit products

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Import the project

2. **Configure Environment Variables**:
   In Vercel dashboard, add all environment variables from `.env.local`

3. **Update Supabase Settings**:
   - In Supabase **Authentication → Settings**
   - Update **Site URL** to your Vercel domain
   - Add your Vercel domain to **Redirect URLs**

4. **Update PayChangu Webhook**:
   - Change webhook URL to: `https://your-vercel-domain.com/api/payment/callback`

### Other Deployment Options

- **Netlify**: Similar to Vercel, supports Next.js
- **Railway**: Good for full-stack apps
- **DigitalOcean App Platform**: Simple deployment
- **AWS Amplify**: Amazon's hosting service

## 🔧 Configuration Options

### Feature Flags
In `lib/config.ts`, you can toggle features:

```typescript
export const FEATURE_FLAGS = {
  ecommerceEnabled: true,        // Enable/disable e-commerce
  paymentEnabled: true,          // Enable/disable payments
  userRegistrationEnabled: true, // Enable/disable registration
  orderTrackingEnabled: true,    // Enable/disable order tracking
};
```

### Company Information
Update your company details in `lib/config.ts`:

```typescript
export const COMPANY_INFO = {
  name: "Your Company Name",
  email: "info@yourcompany.com",
  phone: "+265-xxx-xxxx",
  whatsapp: "+265-xxx-xxxx",
  address: "Your Address",
  // ... other details
};
```

## 🛡️ Security Considerations

### Environment Variables
- **Never commit** `.env.local` to version control
- **Keep service role key secret** - it has full database access
- **Use strong passwords** for Supabase and PayChangu accounts

### Database Security
- **Row Level Security** is enabled on all tables
- **User roles** control access to admin features
- **Webhook signatures** verify PayChangu callbacks

### Production Security
- **Always use HTTPS** in production
- **Set up monitoring** for errors and performance
- **Regular backups** of database
- **Keep dependencies updated**

## 🆘 Troubleshooting

### Common Issues

#### "Authentication not working"
- ✅ Check Supabase Site URL and Redirect URLs
- ✅ Verify environment variables are correct
- ✅ Ensure `.env.local` is not in `.gitignore`

#### "Database connection errors"
- ✅ Verify Supabase URL and keys in `.env.local`
- ✅ Check if Supabase project is active
- ✅ Run database setup SQL files

#### "Payment webhook failures"
- ✅ Verify PayChangu webhook URL is correct
- ✅ Check webhook signature verification
- ✅ Review server logs for errors

#### "Products not loading"
- ✅ Check if database schema is set up correctly
- ✅ Verify RLS policies allow access
- ✅ Add sample products via SQL or admin dashboard

#### "Admin access denied"
- ✅ Check user role in `profiles` table
- ✅ Ensure user is logged in
- ✅ Verify RLS policies for admin access

### Getting Help

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **PayChangu Docs**: [developer.paychangu.com](https://developer.paychangu.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## 📁 Project Structure

```
esl/
├── app/                          # Next.js App Router
│   ├── (pages)/                  # Grouped routes
│   ├── admin/                    # Admin dashboard
│   ├── api/payment/              # Payment API endpoints
│   ├── checkout/                 # Checkout flow
│   ├── dashboard/                # User dashboard
│   └── globals.css               # Global styles
├── components/                   # Reusable components
├── contexts/                     # React Context providers
├── lib/                          # Utility functions and services
│   ├── hooks/                    # Custom React hooks
│   ├── paychangu/                # PayChangu integration
│   └── supabase/                 # Supabase services
├── public/                       # Static assets
├── supabase/                     # Database setup files
├── .env.example                  # Environment template
├── SUPABASE_SETUP.md            # Detailed Supabase guide
└── README.md                     # This file
```

## 📈 Business Features

### For Customers
- Browse products with filtering and search
- User registration and authentication
- Shopping cart and checkout
- Secure payment processing
- Order tracking and history
- Download order receipts

### For Administrators
- Comprehensive dashboard with analytics
- Product management and inventory tracking
- Order management and status updates
- User management with role-based access
- Real-time notifications for new orders
- Sales reporting and analytics

### For Business Growth
- SEO-optimized product pages
- Mobile-responsive design
- Real-time inventory management
- Automated order processing
- Payment webhook integration
- Analytics and reporting tools

## 🔄 Backup & Maintenance

### Regular Backups
1. **Database**: Supabase automatically backs up daily
2. **Manual Backup**: Download from Supabase dashboard
3. **Code**: Ensure repository is backed up on GitHub

### Monitoring
1. **Supabase Dashboard**: Monitor database performance
2. **Vercel Analytics**: Track website performance
3. **PayChangu Dashboard**: Monitor payment transactions

### Updates
1. **Dependencies**: Run `npm update` regularly
2. **Security**: Keep Next.js and dependencies updated
3. **Monitoring**: Set up alerts for errors and downtime

---

## 🎉 Congratulations!

You now have a fully functional e-commerce platform for Energy Solutions Limited. The application includes:

- ✅ Product catalog with categories
- ✅ User authentication and profiles
- ✅ Shopping cart and checkout
- ✅ Secure payment processing
- ✅ Order management system
- ✅ Admin dashboard with analytics
- ✅ Real-time notifications
- ✅ Mobile-responsive design
- ✅ Production-ready deployment

Start by setting up your Supabase project, adding your first admin user, and uploading some products. Your customers can then browse, purchase, and track their orders while you manage everything through the admin dashboard.

**Happy selling! 🚀**