# WebLaunch Lab CRM - Production Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to your project on vercel.com
   - Settings → Environment Variables
   - Add all variables from `.env.production`

4. **Configure Custom Domain**:
   - Vercel Dashboard → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Netlify

1. **Build the project**:
   ```bash
   npm run build:production
   ```

2. **Deploy to Netlify**:
   - Drag the `.next` folder to Netlify
   - Or connect your Git repository

3. **Configure Environment Variables** in Netlify Dashboard

### Option 3: VPS/Server Deployment

1. **Build the project**:
   ```bash
   npm run build:production
   ```

2. **Copy files to server**:
   ```bash
   scp -r .next package.json your-server:/var/www/crm/
   ```

3. **Install dependencies on server**:
   ```bash
   npm install --production
   ```

4. **Start with PM2**:
   ```bash
   pm2 start npm --name "crm" -- start
   ```

## 🔧 Environment Variables Required

Copy these to your production hosting platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://kcrdwhytjclqxlyvmowd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
```

## 🌐 Custom Domain Setup

### DNS Configuration
Add these DNS records to your domain:

**For Vercel:**
- Type: CNAME
- Name: @ (or subdomain like 'crm')
- Value: cname.vercel-dns.com

**For Netlify:**
- Type: CNAME  
- Name: @ (or subdomain like 'crm')
- Value: your-app.netlify.app

## 🔒 Security Checklist

- ✅ Environment variables configured
- ✅ HTTPS enabled
- ✅ Supabase RLS policies active
- ✅ Admin-only routes protected
- ✅ API routes secured

## 🧪 Testing Production

1. **Test Login**: https://yourdomain.com/login
2. **Test Dashboard**: https://yourdomain.com/admin/dashboard
3. **Test CRUD Operations**: Add/Edit/Delete contacts
4. **Test Kanban**: Drag and drop functionality
5. **Test Mobile**: Responsive design

## 📊 Post-Deployment

1. **Monitor Performance**: Check loading times
2. **Check Logs**: Monitor for errors
3. **Test Email**: Configure AWS SES for production
4. **Backup Data**: Regular Supabase backups