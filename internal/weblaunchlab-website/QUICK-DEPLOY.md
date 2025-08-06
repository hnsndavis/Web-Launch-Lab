# 🚀 Quick Deploy to Vercel (5 minutes)

## Option 1: One-Click Deploy

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy** (from your project directory):
   ```bash
   vercel --prod
   ```

3. **Follow prompts**:
   - Link to your account
   - Choose project name
   - Deploy!

4. **Add Environment Variables**:
   - Go to vercel.com → Your Project → Settings → Environment Variables
   - Add these:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://kcrdwhytjclqxlyvmowd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcmR3aHl0amNscXhseXZtb3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDkzNTYsImV4cCI6MjA3MDA4NTM1Nn0.SXgOgImK9bt4goKllLFP5kIlzRnb-aHsLvpcDggEIW0
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcmR3aHl0amNscXhseXZtb3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUwOTM1NiwiZXhwIjoyMDcwMDg1MzU2fQ.tw11bdHIydN4fO2H67SvYhGQiy-Yr_a-omTgi9T-zWM
   NODE_ENV=production
   ```

5. **Redeploy after adding env vars**:
   ```bash
   vercel --prod
   ```

## Option 2: GitHub Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy CRM to production"
   git push
   ```

2. **Connect to Vercel**:
   - Go to vercel.com
   - Import your GitHub repo
   - Add environment variables
   - Deploy!

## 🌐 Custom Domain Setup

**After deployment:**

1. **Get Vercel URL** (something like `your-crm.vercel.app`)

2. **Add Custom Domain in Vercel**:
   - Vercel Dashboard → Domains
   - Add your domain (e.g., `crm.weblaunchlab.com`)

3. **Update DNS**:
   - Add CNAME record: `crm` → `cname.vercel-dns.com`
   - Or A record: `@` → Vercel's IP

## ✅ Test After Deploy

1. **Login**: `https://yourdomain.com/login`
2. **Credentials**: `admin@weblaunchlab.com` / `password`
3. **Test Features**: Add/Edit contacts, Kanban view

## 🎯 You're Live!

Your CRM will be accessible at your custom domain with:
- ✅ Secure HTTPS
- ✅ Fast global CDN  
- ✅ Automatic scaling
- ✅ Admin dashboard
- ✅ Supabase integration