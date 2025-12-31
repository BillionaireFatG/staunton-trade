# Setup Instructions

## 1. Apply Database Migration

You need to run the migration to create the profiles and chat tables:

### Option A: Using Supabase CLI (Recommended)
```bash
cd staunton-frontend
supabase db push
```

### Option B: Using Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste the entire contents of `supabase/migrations/003_profiles_and_chat.sql`
6. Click **Run**

## 2. Verify Tables Created

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see these new tables:
   - `profiles`
   - `verification_requests`
   - `conversations`
   - `messages`

## 3. Verify Storage Buckets

In Supabase Dashboard:
1. Go to **Storage**
2. You should see these buckets:
   - `avatars` (public)
   - `verification-docs` (private)

## 4. Restart Dev Server

After applying the migration:
```bash
# Stop the dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

## 5. Test the Flow

1. Sign up with a new account
2. You should be redirected to `/onboarding`
3. Complete your profile
4. You should be redirected to `/dashboard`
5. No more profile errors in console!

## Troubleshooting

### Error: "relation 'profiles' does not exist"
- The migration hasn't been applied yet
- Run the migration using one of the methods above

### Error: "Error fetching profile"
- If you see PGRST116 error code: This is normal, profile doesn't exist yet
- If you see other errors: Check Supabase logs in dashboard

### Profile not saving
- Check RLS policies are enabled
- Check your user is authenticated
- Check browser console for detailed errors


