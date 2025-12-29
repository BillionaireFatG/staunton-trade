# Quick Start Guide - Authentication Setup

## 🚀 Immediate Action Items

### 1. Set Environment Variables

Create a `.env.local` file in the `staunton-frontend` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from: https://app.supabase.com/project/_/settings/api

### 2. Configure Supabase Dashboard

Go to your Supabase project: https://app.supabase.com

#### A. Set Redirect URLs
1. Navigate to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://stauntontrade.com`
3. Add these to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://stauntontrade.com/auth/callback
   ```
4. Click **Save**

#### B. Configure Email Settings (Optional)
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **Enable email confirmations** based on your preference:
   - ✅ **ON** = Users must verify email before full access
   - ❌ **OFF** = Users can access immediately after sign-up

### 3. Deploy to Production

When deploying to Vercel/Netlify/etc:

1. Add environment variables in your hosting dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Make sure your production domain is `stauntontrade.com` (or update the code if different)

### 4. Test the Flow

#### Local Testing:
```bash
cd staunton-frontend
npm run dev
```

1. Go to http://localhost:3000/sign-up
2. Create an account
3. Check your email
4. Click the verification link
5. Should redirect to dashboard

#### Production Testing:
1. Go to https://stauntontrade.com/sign-up
2. Create an account
3. Check your email
4. Click the verification link
5. Should redirect to dashboard

## ✅ What's Fixed

- ✅ Email verification links now go to production domain
- ✅ Auth state persists across page refreshes
- ✅ Sessions persist across browser sessions
- ✅ Automatic session restoration on app load
- ✅ Proper callback handling for email verification
- ✅ Global auth state management
- ✅ Secure PKCE flow implementation

## 📁 Files Changed

- `lib/supabase.ts` - Enhanced client config
- `app/auth/callback/route.ts` - NEW: Handles email verification
- `app/sign-up/page.tsx` - Added redirect URL and success screen
- `app/sign-in/page.tsx` - Added auth state listener
- `components/AuthProvider.tsx` - NEW: Global auth state
- `app/layout.tsx` - Added AuthProvider
- `middleware.ts` - Added callback route exception

## 🔍 Verification

After setup, verify these work:

- [ ] Sign up sends email to production callback URL
- [ ] Clicking email link redirects to production domain
- [ ] User is logged in after verification
- [ ] Session persists after page refresh
- [ ] Session persists after closing browser
- [ ] Sign out and sign in works correctly

## 📚 Additional Documentation

- **ENV_SETUP.md** - Detailed environment setup guide
- **AUTH_FIXES.md** - Complete technical documentation of all changes

## 🆘 Need Help?

Common issues and solutions are in `AUTH_FIXES.md` under "Troubleshooting"

## 🔐 Important Notes

1. **Domain Configuration:** If your production domain is NOT `stauntontrade.com`, update:
   - Supabase Site URL in dashboard
   - Redirect URL in Supabase dashboard
   - The domain is dynamically detected in code, so no code changes needed!

2. **Email Verification:** Users can sign in even without verifying email (Supabase default). The verification just confirms the email address.

3. **Session Storage:** Sessions are stored in localStorage and automatically refreshed.

4. **Security:** The app uses PKCE flow for enhanced security.

