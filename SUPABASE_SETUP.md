# Supabase Setup Guide for ESL E-commerce Platform

This guide will help you set up Supabase for the Energy Solutions Limited e-commerce platform with authentication, database, and admin roles.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic understanding of SQL

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: `energy-solutions-esl`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., Singapore for Africa)
5. Click **"Create new project"**
6. Wait 2-3 minutes for project initialization

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PayChangu (for payments - optional for now)
PAYCHANGU_API_KEY=your_paychangu_api_key
PAYCHANGU_SECRET_KEY=your_paychangu_secret_key
PAYCHANGU_ENCRYPTION_KEY=your_32_character_encryption_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Energy Solutions Limited"
```

## Step 4: Run Database Migrations

The project includes pre-built migration files. Run them in this order:

### 4.1 Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/20250913062132_soft_ocean.sql`
3. Click **Run** to create all tables, functions, and sample data

### 4.2 Set Up Security Policies
1. Copy and paste the contents of `supabase/migrations/20250913062247_aged_water.sql`
2. Click **Run** to create Row Level Security policies

### 4.3 Configure Storage
1. Copy and paste the contents of `supabase/migrations/20250913062315_copper_voice.sql`
2. Click **Run** to create storage buckets and policies

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication → Settings**
2. Set **Site URL**: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://yourdomain.com/**` (for production)
4. **DISABLE email confirmation** - we use custom 6-digit verification for customers
5. Enable **Email** authentication
6. **Important**: 
   - Customers use custom 6-digit verification codes
   - Admin users are auto-verified (no email confirmation needed)
   - Set "Enable email confirmations" to OFF in Auth settings

## Step 6: Create Your First Admin User

### Option 1: Register Through the App (Recommended)
1. Start your development server: `npm run dev`
2. Go to any product page and click "Buy Now"
3. Register a new account with your email
4. Note your user ID from the Supabase dashboard (**Authentication → Users**)

### Option 2: Create Directly in Database
1. In Supabase **SQL Editor**, run:
```sql
-- Insert a user directly (replace with your details)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@esl.mw',
  crypt('your-password', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

### Assign System Admin Role
After creating your user account, assign the system admin role:

1. In Supabase **SQL Editor**, run:
```sql
-- Replace 'your-user-id' with the actual user ID from Authentication → Users
UPDATE profiles 
SET role = 'system_admin' 
WHERE email = 'your-email@example.com';

-- Also mark admin as email verified (admins don't need verification)
UPDATE profiles 
SET email_verified = true 
WHERE email = 'your-email@example.com';
```

## Step 7: Test the System

### Test Customer Flow
1. Go to `/products`
2. Click on any product
3. Click "Buy Now"
4. Register as a customer (you'll need to verify email with 6-digit code)
5. Check console for verification code (in development)
6. Enter the 6-digit code to verify your email
7. Complete the checkout process
8. Check your dashboard at `/dashboard`

### Test Admin Access
1. Login with your admin account
2. Go to `/admin` - you should be redirected to `/admin/system-admin`
3. Create other admin users through the interface

## Step 8: Create Additional Admin Users

As a system admin, you can create other admin users:

1. Go to `/admin/system-admin`
2. Click "Create Admin User" in Quick Actions
3. Fill in the admin details and select role:
   - **Sales Admin**: Manages products, orders, customers
   - **Web Admin**: Manages content, services, projects
   - **Helpdesk**: Manages customer communications
4. Admin users are automatically email-verified (no verification needed)

## Email Verification System

### For Customers
- **6-Digit Verification**: Customers receive a 6-digit code via email
- **Code Expiry**: Codes expire after 10 minutes
- **Rate Limiting**: Maximum 3 attempts per code, 60-second resend cooldown
- **Required for Shopping**: Must verify email before making purchases

### For Admins
- **Auto-Verified**: Admin accounts are automatically email-verified
- **No Verification Needed**: Admins can access their dashboards immediately
- **Created by System Admin**: Only system admins can create other admin accounts

## Admin Role Permissions

### System Admin (`system_admin`)
- **Access**: `/admin/system-admin`
- **Permissions**: Full system access, user management, create other admins
- **Responsibilities**: System configuration, user roles, security

### Sales Admin (`sales_admin`)
- **Access**: `/admin/sales-admin`
- **Permissions**: Product CRUD, order management, customer data, sales analytics
- **Responsibilities**: Product catalog, order processing, sales reporting

### Web Admin (`web_admin`)
- **Access**: `/admin/web-admin`
- **Permissions**: Content CRUD (services, projects, staff, testimonials)
- **Responsibilities**: Website content, project showcase, team management

### Helpdesk (`helpdesk`)
- **Access**: `/admin/helpdesk`
- **Permissions**: View/respond to contact forms and inquiries
- **Responsibilities**: Customer support, communication management

## Step 9: Production Deployment

### Environment Variables for Production
Update your production environment with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Update Supabase Settings for Production
1. In **Authentication → Settings**:
   - Update **Site URL** to your production domain
   - Add production domain to **Redirect URLs**
2. In **API → Settings**:
   - Configure CORS if needed

## Troubleshooting

### Common Issues

#### "User not found" after registration
- Check if the `handle_new_user()` trigger is working
- Verify the user appears in both `auth.users` and `profiles` tables
- For customers, ensure they complete email verification

#### "Access denied" for admin users
- Verify the user's role in the `profiles` table
- Ensure admin users have `email_verified = true`
- Check RLS policies are correctly applied

#### Email verification not working
- Check console logs for verification codes (in development)
- Verify email service integration (in production)
- Ensure verification codes haven't expired (10-minute limit)

#### Products not loading
- Ensure sample products were inserted during schema setup
- Check if products are marked as `is_active = true`

#### Authentication not working
- Verify environment variables are correct
- Check Supabase project URL and keys
- Ensure Site URL is configured correctly

### Getting Help

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues**: Check the console for error messages

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit `.env.local`** to version control
2. **Keep service role key secret** - it has full database access
3. **Use strong passwords** for admin accounts
4. **Email Verification**: Customers must verify emails, admins are auto-verified
4. **Enable 2FA** on your Supabase account
5. **Regular backups** - Supabase provides automatic backups
6. **Monitor access logs** in the Supabase dashboard

## Next Steps

After setup is complete:

1. **Add Products**: Use the sales admin panel to add your product catalog
2. **Configure PayChangu**: Set up payment processing for live transactions
3. **Email Service**: Integrate with SendGrid/Mailgun for production email verification
3. **Customize Content**: Use web admin to update services, projects, and team info
4. **Test Thoroughly**: Test all user flows before going live
5. **Set Up Monitoring**: Configure error tracking and performance monitoring

Your e-commerce platform is now ready with:
- ✅ 6-digit email verification for customers
- ✅ Auto-verified admin accounts
- ✅ Role-based admin access
- ✅ Complete e-commerce functionality
- ✅ Real-time updates and secure payments