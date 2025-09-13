# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build production application with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Architecture

This is a Next.js 15 application for Energy Solutions Limited (ESL), an energy company providing renewable energy solutions with integrated e-commerce functionality.

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Outfit (Google Fonts)
- **Build Tool**: Turbopack (built into Next.js)
- **State Management**: React Context (Auth, Cart)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Payment Gateway**: Paychangu integration with webhook security
- **Storage**: Supabase with local storage fallback

### Directory Structure
```
app/
├── (pages)/           # Route groups for organized routing
│   ├── about-us/
│   ├── clients/
│   ├── partnerships/
│   ├── products/
│   │   └── [product]/  # Dynamic product detail pages
│   └── projects/
├── checkout/          # Checkout flow pages
│   ├── success/       # Payment success page
│   └── cancel/        # Payment cancelled page
├── dashboard/         # User dashboard and order history
├── admin/             # Admin dashboard with role-based access
├── api/               # API routes for payment and webhooks
│   └── payment/       # PayChangu integration endpoints
├── globals.css        # Global styles (imports Tailwind)
├── layout.tsx         # Root layout with context providers
└── page.tsx           # Homepage (large single-file component)

components/            # Reusable React components
├── AuthModal.tsx      # Authentication modal component

contexts/              # React Context providers
├── AuthContext.tsx    # Supabase authentication with local fallback
└── CartContext.tsx    # Shopping cart state

lib/                   # Utility functions and services
├── config.ts          # App configuration and feature flags
├── orderService.ts    # Order management with Supabase integration
├── paychangu.ts       # Payment gateway integration
├── products.ts        # Product data with Supabase integration
├── types.ts           # TypeScript type definitions (includes Supabase)
├── utils.ts           # Utility functions
├── hooks/             # Custom React hooks
│   └── useRealtime.ts # Supabase realtime subscriptions
├── supabase/          # Supabase integration layer
│   ├── client.ts      # Browser Supabase client
│   ├── server.ts      # Server Supabase client
│   ├── middleware.ts  # Auth middleware
│   ├── admin.ts       # Admin service role client
│   ├── products.ts    # Products service
│   └── orders.ts      # Orders service
└── paychangu/         # PayChangu integration
    ├── client.ts      # PayChangu API client
    └── security.ts    # Webhook signature verification

supabase/              # Database schema and setup
├── schema.sql         # Complete database schema
├── policies.sql       # Row Level Security policies
└── storage.sql        # Storage buckets and policies

public/                # Static assets (images)
```

## E-commerce Implementation

### Feature Flags System
E-commerce functionality is controlled by feature flags in `lib/config.ts`:
```typescript
export const FEATURE_FLAGS = {
  ecommerceEnabled: true,    // Set to false to disable e-commerce
  paymentEnabled: true,      // Set to false to disable payments
  userRegistrationEnabled: true,
  orderTrackingEnabled: true,
};
```

### Key Components

#### Authentication System
- **Context**: `contexts/AuthContext.tsx` - Manages user authentication state
- **Storage**: Secure local storage with base64 encoding for demo purposes
- **Features**: User registration, login, profile management
- **Validation**: Email, phone number (Malawi format), password strength

#### Cart Management
- **Context**: `contexts/CartContext.tsx` - Shopping cart state management
- **Features**: Add/remove items, quantity updates, total calculations
- **Persistence**: Local storage with automatic sync

#### Order Management
- **Service**: `lib/orderService.ts` - Complete order lifecycle management
- **Features**: Order creation, status tracking, payment processing, receipt generation
- **Storage**: Local storage with encrypted data

#### Payment Integration
- **Service**: `lib/paychangu.ts` - Paychangu payment gateway integration
- **Features**: Payment initialization, verification, webhook handling
- **Development Mode**: Simulated payments for testing

### User Journey
1. **Browse Products** - `/products` with filtering and search
2. **View Product Details** - `/products/[product-slug]` with buy button
3. **Authentication** - Modal-based registration/login
4. **Checkout Process** - Multi-step checkout with shipping address
5. **Payment** - Paychangu integration with multiple payment methods
6. **Order Confirmation** - Success/cancel pages with order details
7. **Order Management** - Dashboard with order history and tracking

### Key Pages

#### Product Detail Page (`app/(pages)/products/[product]/page.tsx`)
- Dynamic routing for product details
- Buy Now and Add to Cart functionality
- Authentication modal integration
- Feature flag controlled e-commerce UI
- Fallback to inquiry system when e-commerce disabled

#### Checkout Flow (`app/checkout/page.tsx`)
- Multi-step checkout process (Shipping → Review → Payment)
- Address validation for Malawi districts
- Order summary with cart management
- Paychangu payment integration
- Error handling and user feedback

#### Dashboard (`app/dashboard/page.tsx`)
- User profile management
- Order history with filtering and search
- Order status tracking
- Receipt download functionality
- Order statistics and insights

### Development Notes

#### Local Storage Structure
- `esl_user` - Current authenticated user data
- `esl_auth` - Authentication state
- `esl_cart` - Shopping cart items
- `esl_orders` - User order history
- `esl_registered_users` - All registered users (demo only)

#### Security Considerations
- Base64 encoding for demo purposes (use proper encryption in production)
- Input validation for all user inputs
- XSS protection through React's built-in sanitization
- Secure payment processing through Paychangu

#### Backend Integration Notes
When implementing a proper backend:
1. Replace local storage with database operations
2. Implement proper user authentication (JWT/sessions)
3. Add server-side validation
4. Implement proper payment webhook handling
5. Add email notifications and SMS alerts
6. Implement proper inventory management
7. Add admin dashboard for order management

### Feature Toggle Usage
To disable e-commerce and fallback to inquiry-only mode:
1. Set `FEATURE_FLAGS.ecommerceEnabled = false` in `lib/config.ts`
2. Product pages will show inquiry buttons instead of purchase options
3. Users can still browse products and contact via email/WhatsApp

### Company Configuration
Company details are centralized in `lib/config.ts` under `COMPANY_INFO`:
- Contact information (phone, email, WhatsApp)
- Business hours
- Services offered
- Social media links

This allows easy updates without touching multiple files.

## Supabase Backend Integration

The application has been enhanced with full Supabase backend integration while maintaining backward compatibility with local storage.

### Backend Architecture
- **Database**: PostgreSQL with comprehensive schema for users, products, orders, payments
- **Authentication**: Supabase Auth with email/password and social providers
- **Storage**: File uploads for product images, user avatars, and documents
- **Real-time**: Live updates for orders, inventory, and notifications
- **Security**: Row Level Security (RLS) policies for data protection

### Key Features
- **Graceful Fallback**: Automatically falls back to local storage if Supabase is unavailable
- **Admin Dashboard**: Role-based access control (super_admin, admin, staff, customer)
- **Payment Integration**: Secure PayChangu webhook handling with signature verification
- **Inventory Management**: Real-time stock tracking and low-stock alerts
- **Order Management**: Complete order lifecycle with status tracking
- **Analytics**: Event tracking and sales reporting

### Setup Instructions
1. **Environment Setup**: Copy `.env.example` to `.env.local` and configure Supabase keys
2. **Database Setup**: Run SQL files in this order:
   - `supabase/schema.sql` - Creates tables, functions, triggers
   - `supabase/policies.sql` - Sets up Row Level Security
   - `supabase/storage.sql` - Creates storage buckets and policies
3. **Admin User**: Register normally, then update role in database:
   ```sql
   UPDATE profiles SET role = 'super_admin' WHERE id = 'your-user-id';
   ```
4. **PayChangu Setup**: Configure webhook URL: `https://yourdomain.com/api/payment/callback`

### Migration Strategy
The application supports gradual migration from local storage to Supabase:
- Existing users continue working with local data
- New features automatically use Supabase when available
- Fallback ensures no data loss during transition

For detailed setup instructions, see `SUPABASE_SETUP.md`.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
- rememberthis project, we do have an auth sytem for customer, the person who buys a product. this person create an account, and signs in.. \
with these changes, will that be afected?