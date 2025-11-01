# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

This project is **ready for Vercel deployment**, but you need to complete the following steps:

### 1. **Supabase Setup** (Required)

Your Supabase project must be set up and running with the following:

#### Database Tables
Run these SQL migrations in your Supabase SQL Editor (in order):
- `scripts/01-create-recipes-tables.sql` - Creates recipes and ingredients tables
- `scripts/02-create-favorites-table.sql` - Creates favorites table
- `scripts/03-update-favorites-with-user.sql` - Adds user_id to favorites
- `scripts/04-create-shopping-lists.sql` - Creates shopping lists tables

#### Row Level Security (RLS)
Make sure RLS policies are enabled and configured for:
- `recipes` table
- `ingredients` table  
- `favorites` table
- `shopping_lists` table
- `shopping_list_items` table

### 2. **Google OAuth Configuration** (Required)

Follow the instructions in `GOOGLE_AUTH_SETUP.md`:

1. Enable Google provider in Supabase Dashboard
2. Configure Google OAuth credentials
3. Add redirect URLs to Supabase:
   - `https://your-app.vercel.app/auth/callback` (production)
   - `http://localhost:3000/auth/callback` (local development)

### 3. **Environment Variables** (Required - MUST BE SET BEFORE FIRST BUILD)

⚠️ **IMPORTANT**: You MUST add environment variables in Vercel BEFORE the first build/deployment!

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these:**
- Go to Supabase Dashboard → Project Settings → API
- Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
- Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**How to add in Vercel:**
1. Go to your Vercel project
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `your_supabase_url`
   - Make sure to check: Production, Preview, and Development
4. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Save"

### 4. **Build Configuration** ✅

The project is already configured:
- ✅ `next.config.mjs` exists with proper settings
- ✅ TypeScript configured
- ✅ Build scripts in `package.json`
- ✅ Dependencies are all listed

### 5. **Deployment Steps**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **⚠️ CRITICAL: Add Environment Variables BEFORE First Build**
   - **DO NOT click "Deploy" yet!**
   - First, go to "Settings" → "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Make sure to enable for Production, Preview, and Development
   - Click "Save"
   - **Only after adding env vars, go back and click "Deploy"**

4. **Update Supabase Redirect URLs**
   - After first deployment, copy your Vercel URL
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel deployment URL: `https://your-app.vercel.app/auth/callback`

5. **Deploy**
   - Click "Deploy" in Vercel
   - Wait for build to complete
   - If build succeeds, your app is live!

### 6. **Post-Deployment Verification**

After deployment, verify:

- ✅ Homepage loads
- ✅ "Continue with Google" button works
- ✅ After login, can view/create recipes
- ✅ Favorites functionality works
- ✅ Shopping lists work
- ✅ Ingredients page works
- ✅ Print functionality works

### 7. **Known Considerations**

- **Database Migrations**: Must be run manually in Supabase SQL Editor before first deployment
- **Google OAuth**: Requires redirect URL to be configured in both Supabase and Google Cloud Console
- **Images**: Configured as `unoptimized: true` in next.config.mjs (can be optimized later if needed)

### 8. **Optional: Custom Domain**

If you want a custom domain:
1. In Vercel project → Settings → Domains
2. Add your domain
3. Update Supabase redirect URLs to include your custom domain
4. Update Google OAuth redirect URIs if using custom domain

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Run locally (requires .env.local with Supabase credentials)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 📝 Notes

- The project uses `pnpm` as package manager (Vercel supports this automatically)
- Next.js 16 with React Server Components
- Supabase for database and authentication
- Google OAuth only (no email/password)
- All features are user-specific and require authentication

