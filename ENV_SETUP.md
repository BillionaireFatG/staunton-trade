# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of the `staunton-frontend` directory with the following variables:

```bash
# Supabase Configuration
# Get these values from your Supabase project settings: https://app.supabase.com/project/_/settings/api

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Production Deployment

When deploying to production (Vercel, Netlify, etc.), make sure to set these environment variables in your hosting platform's dashboard.

## Supabase Configuration

### 1. Set up Redirect URLs in Supabase Dashboard

Go to your Supabase project dashboard:
1. Navigate to **Authentication** → **URL Configuration**
2. Add the following URLs to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://stauntontrade.com/auth/callback` (for production)
3. Set **Site URL** to: `https://stauntontrade.com`

### 2. Email Templates (Optional)

To customize your email verification template:
1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup**
3. Make sure the confirmation link uses: `{{ .ConfirmationURL }}`
4. The URL will automatically redirect to your configured callback URL

### 3. Email Settings

Ensure email confirmation is enabled:
1. Go to **Authentication** → **Providers** → **Email**
2. Check **Enable email confirmations** if you want users to verify their email
3. Or uncheck it if you want to allow immediate sign-in without verification

## Testing

### Local Development
1. Start your development server: `npm run dev`
2. Sign up with a test email
3. Check your email for the verification link
4. Click the link - it should redirect to `http://localhost:3000/auth/callback` and then to `/dashboard`

### Production
1. Deploy your application
2. Sign up with a real email
3. Check your email for the verification link
4. Click the link - it should redirect to `https://stauntontrade.com/auth/callback` and then to `/dashboard`

## Troubleshooting

### Issue: Verification links redirect to localhost in production
**Solution**: Make sure you've set the **Site URL** in Supabase to `https://stauntontrade.com` and added the production callback URL to **Redirect URLs**.

### Issue: "Invalid redirect URL" error
**Solution**: Double-check that your callback URL is added to the **Redirect URLs** list in Supabase dashboard.

### Issue: Users can log in directly without verification
**Solution**: This is expected behavior. Supabase allows users to sign in even if their email isn't verified. The `email_confirmed_at` field will be null until they verify. You can add additional checks in your code if needed.


