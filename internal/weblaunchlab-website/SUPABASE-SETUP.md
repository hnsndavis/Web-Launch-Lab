# Supabase Setup Guide

## ✅ Quick Setup (10 minutes)

### Step 1: Create Supabase Project (3 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name**: `weblaunchlab-crm`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

### Step 2: Get Your Credentials (2 minutes)
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **URL**: `https://YOUR_PROJECT_ID.supabase.co`
   - **anon key**: Long key starting with `eyJhbGc...`
   - **service_role key**: Another long key (keep secret!)

### Step 3: Configure Environment (1 minute)
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your real credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Run Database Migration (2 minutes)

**Option A: Automated (try this first)**
```bash
npm run db:migrate
```

**Option B: Manual (if automated fails)**
1. Go to your Supabase dashboard
2. Click **SQL Editor** → **New Query**
3. Copy and paste the entire contents of `supabase/migrations/20250806201738_initial_schema.sql`
4. Click **"Run"**

### Step 5: Test & Add Demo Data (2 minutes)
```bash
# Test connection
npm run db:test

# Add demo data
npm run db:seed
```

## 🚀 You're Ready!

Your Supabase setup is complete! You can now:

```bash
npm run dev
```

**Login with:**
- Email: `admin@weblaunchlab.com`
- Password: `password`

## 📊 What You Get

✅ **Cloud PostgreSQL Database** - Fully managed
✅ **Real-time Subscriptions** - Live updates
✅ **Row Level Security** - Built-in auth policies  
✅ **Auto-generated APIs** - REST and GraphQL
✅ **Database Migrations** - Version controlled schema
✅ **Admin Dashboard** - Web interface for data

## 🔧 Useful Commands

```bash
# Test database connection
npm run db:test

# Run migration
npm run db:migrate  

# Add demo data
npm run db:seed

# Generate TypeScript types (coming soon)
npm run supabase:types
```

## 🆘 Troubleshooting

**Migration fails?**
- Use Option B (manual) from Step 4
- Check your credentials in `.env.local`

**Can't connect?**
- Verify your Supabase URL and keys
- Make sure project is fully created (green status)

**No data showing?**
- Run `npm run db:seed` to add demo data
- Check the Activities tab in Supabase dashboard

## 🎯 Next: Stripe Integration

Once this is working, we'll add:
- Payment processing for $497 setup fees
- $49/month subscription management  
- Customer billing portal
- Webhook handling