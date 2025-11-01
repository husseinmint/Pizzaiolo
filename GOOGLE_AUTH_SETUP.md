# Google OAuth Setup Guide

## Yes, we're using Supabase Auth with Google OAuth only!

This application now uses **Google OAuth only** for authentication. Users must sign in with their Google account to access the app.

## Setup Instructions

### 1. Enable Google Provider in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click on it
4. Toggle **Enable Google provider**
5. You'll need to configure OAuth credentials:

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if you haven't already:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information
   - Add scopes: `email`, `profile`
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Your app name (e.g., "Pizzailo")
   - Authorized redirect URIs: 
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     (Replace `<your-project-ref>` with your Supabase project reference)
7. Copy the **Client ID** and **Client Secret**

### 3. Configure Supabase Google Provider

1. Back in Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

### 4. Update Redirect URLs

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   ```

### 5. Environment Variables

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How It Works

- Users click "Continue with Google" on the login page
- They're redirected to Google's OAuth page
- After authorizing, they're redirected back to `/auth/callback`
- Supabase handles the authentication and creates/logs in the user
- The user is then redirected to `/recipes`

## Features

- ✅ **Google OAuth only** - No email/password authentication
- ✅ **Automatic signup** - First-time users are automatically created
- ✅ **User-specific favorites** - Each user has their own favorites
- ✅ **Protected routes** - Create/edit recipes requires authentication


