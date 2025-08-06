# WebLaunch Lab CRM MVP

## Quick Setup (1-Hour MVP)

### 1. Supabase Setup (10 minutes)
1. Go to [Supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run this schema:

```sql
-- Contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  name text NOT NULL,
  company text,
  industry text,
  source text,
  status text DEFAULT 'new',
  score integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Users table (for admin auth)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'client',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

3. Get your project URL and keys from Settings > API

### 2. Environment Variables (5 minutes)
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

### 3. AWS SES Setup (15 minutes)
1. Go to AWS Console > SES
2. Verify your sending email domain/address
3. Create IAM user with SES permissions
4. Add AWS credentials to `.env.local`:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `FROM_EMAIL`: Your verified email

### 4. Install & Run (5 minutes)
```bash
npm install
npm run dev
```

### 5. Add Demo Data (5 minutes)
```bash
node scripts/setup-demo-data.js
```

## What You Get

✅ **Contact Management**: Add, view, search contacts
✅ **Email Sending**: Send emails directly to contacts via AWS SES  
✅ **Activity Logging**: Track all interactions automatically
✅ **Dashboard Stats**: Real-time metrics from Supabase
✅ **Responsive UI**: Beautiful Tailwind CSS interface
✅ **Authentication**: Supabase Auth with role-based access

## Login
- Email: `admin@weblaunchlab.com`
- Password: `password`

## Features Working
- ✅ Contact list with search/filter
- ✅ Send email modal with AWS SES
- ✅ Activity tracking
- ✅ Real-time dashboard stats
- ✅ Responsive design
- ✅ Supabase backend

## Next Steps
After this MVP is working, you can add:
- Email templates with Maizzle
- Campaign builder
- Google Calendar integration
- Typeform webhooks
- Advanced analytics