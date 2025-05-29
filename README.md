# EV-Trader Marketplace

A comprehensive electric vehicle marketplace platform built with Next.js, Supabase, and modern web technologies.

## 🚗 Project Overview

EV-Trader is a full-featured marketplace for buying and selling electric vehicles. The platform connects individual sellers with buyers and provides dealership solutions for professional EV sales.

## 📚 Documentation

This project includes comprehensive documentation to help you understand and contribute to the EV-Trader platform:

- **[Product Requirements Document (PRD)](./docs/PRD.md)** - Complete product vision, goals, features, and roadmap
- **[Development Progress](./docs/DEVELOPMENT_PROGRESS.md)** - Current development status, completed features, and milestones
- **[Email System Documentation](./src/lib/email/README.md)** - Email service architecture and templates
- **[Database Schema](./docs/database-schema.md)** - Complete database structure and relationships (coming soon)
- **[API Documentation](./docs/api-reference.md)** - API endpoints and usage guide (coming soon)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **Authentication**: Clerk
- **Payments**: Stripe
- **Email**: Nodemailer with Azure Communication Services
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Ready for Vercel/Netlify

## 📋 Features Implemented

### ✅ Core Infrastructure
- [x] Next.js 15 application setup
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] Environment configuration
- [x] Database schema design

### ✅ Authentication & User Management
- [x] Clerk authentication integration
- [x] User profiles with role-based access
- [x] Admin/Individual/Dealership user types
- [x] User verification system with document upload

### ✅ Database Architecture
- [x] Complete Supabase schema with 10+ tables
- [x] Row-level security (RLS) policies
- [x] Performance indexes
- [x] Foreign key relationships
- [x] Data validation constraints

### ✅ Admin Dashboard
- [x] Real-time statistics dashboard
- [x] User verification management
- [x] Listing approval system
- [x] Activity logging and audit trails
- [x] Admin-only access controls

### ✅ Email System
- [x] Comprehensive email service with 11 templates
- [x] Email queue with retry logic
- [x] SMTP connection testing
- [x] Azure Communication Services integration
- [x] Email management dashboard
- [x] Automated notifications

### ✅ Listing Management
- [x] Vehicle listing creation
- [x] Image upload and management
- [x] Listing approval workflow
- [x] Featured listings system
- [x] Bump-up functionality

### ✅ Subscription & Pricing
- [x] Multiple pricing tiers (Individual & Dealership)
- [x] Stripe payment integration
- [x] Subscription management
- [x] Feature-based access control

### ✅ Messaging System
- [x] In-app messaging between users
- [x] Message notifications
- [x] Conversation management

## 🗂️ Project Structure

```
ev-trader/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard pages
│   │   └── (auth)/            # Authentication pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── admin/            # Admin-specific components
│   ├── lib/                   # Utility libraries
│   │   ├── email/            # Email service
│   │   ├── supabase/         # Database clients
│   │   └── utils/            # Helper functions
│   └── hooks/                 # Custom React hooks
├── docs/                      # Project documentation
├── public/                    # Static assets
└── database/                  # Database migrations & schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account
- Stripe account
- Azure Communication Services (for email)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ev-trader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.local.example` to `.env.local` and configure:

   ```bash
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Email (Azure Communication Services)
   SMTP_HOST=smtp.azurecomm.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   SMTP_FROM_NAME=EV-Trader
   SMTP_FROM_EMAIL=your_from_email
   ```

4. **Database Setup**
   
   Run the database migrations in Supabase SQL editor:
   ```sql
   -- See database/schema.sql for complete setup
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📊 Database Schema

### Core Tables
- **profiles** - User profile information
- **vehicles** - Vehicle listings
- **vehicle_images** - Vehicle photos
- **listing_plans** - Subscription plans
- **listing_purchases** - Plan purchases
- **user_verifications** - Identity verification
- **dealership_profiles** - Dealership information
- **messages** - In-app messaging
- **email_queue** - Email processing queue
- **email_logs** - Email audit trail

## 🔐 Security Features

- Row-level security (RLS) on all tables
- Admin-only access controls
- User data isolation
- Secure file uploads
- API route protection
- Environment variable security

## 📧 Email System

The platform includes a comprehensive email system:

### Templates Available
1. Welcome emails
2. Verification notifications
3. Listing approvals/rejections
4. Message notifications
5. Password reset
6. Subscription confirmations
7. Admin notifications

### Features
- Queue-based processing
- Retry logic (up to 3 attempts)
- SMTP connection testing
- Email management dashboard
- Automated cleanup

## 💳 Pricing Plans

### Individual Plans
- **EV Essentials**: €24.99 (5 listings, 30 days)
- **EV Accelerator**: €44.99 (15 listings, 60 days, featured)
- **EV Premium Pro**: €74.99 (unlimited listings, 90 days, premium features)

### Dealership Plans
- **Starter**: €89/month (50 listings)
- **Pro**: €249/month (200 listings, priority support)
- **Titan**: €599/month (unlimited listings, white-label)

## 🔧 API Endpoints

### Admin Routes
- `GET/POST /api/admin/stats` - Dashboard statistics
- `GET/POST /api/admin/verifications` - User verification management
- `GET/POST /api/admin/listings` - Listing approval
- `GET/POST /api/admin/email/queue` - Email queue management
- `POST /api/admin/email/test-connection` - SMTP testing

### User Routes
- `GET/POST /api/listing-plans` - Subscription plans
- `GET/POST /api/vehicles` - Vehicle listings
- `GET/POST /api/messages` - Messaging system

## 🧪 Testing

The project includes comprehensive testing for:
- Email functionality (SMTP connection & sending)
- Database operations
- API endpoints
- User authentication flows

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices
- Touch interfaces

## 🚀 Deployment

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SMTP settings verified
- [ ] Stripe webhooks configured
- [ ] Domain DNS configured
- [ ] SSL certificates enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🔄 Recent Updates

### Latest Changes (January 2025)
- ✅ Fixed SMTP connection issues with Azure Communication Services
- ✅ Consolidated duplicate email testing functionality
- ✅ Enhanced error handling and debugging
- ✅ Improved email queue management
- ✅ Updated database schema optimizations

---

**EV-Trader** - Revolutionizing the electric vehicle marketplace 🚗⚡
