# Authentication Flow Documentation

## 📊 Complete Authentication Flow

### Sign-Up Flow

```
User fills form
    ↓
App calls supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: 'https://stauntontrade.com/auth/callback'
  }
})
    ↓
Supabase sends verification email
    ↓
User sees "Check your email" screen
    ↓
User clicks link in email
    ↓
Browser navigates to:
https://stauntontrade.com/auth/callback?code=abc123...
    ↓
Callback route handler:
- Receives code
- Calls exchangeCodeForSession(code)
- Sets session cookies
- Redirects to /dashboard
    ↓
User is logged in!
```

### Sign-In Flow

```
User enters credentials
    ↓
App calls supabase.auth.signInWithPassword()
    ↓
onAuthStateChange listener fires
    ↓
Event: 'SIGNED_IN'
    ↓
Auto-redirect to /dashboard
    ↓
Session saved to localStorage
    ↓
User is logged in!
```

### Session Persistence Flow

```
User closes browser
    ↓
User returns later
    ↓
App loads
    ↓
AuthProvider mounts
    ↓
Calls supabase.auth.getSession()
    ↓
Reads from localStorage
    ↓
Session found and valid?
    ├─ YES → User auto-logged in
    └─ NO → User sees sign-in page
```

### Middleware Protection Flow

```
User navigates to /dashboard
    ↓
Middleware intercepts request
    ↓
Calls supabase.auth.getUser()
    ↓
User authenticated?
    ├─ YES → Allow access to /dashboard
    └─ NO → Redirect to /sign-in
```

## 🔄 Auth State Management

### Client-Side (Browser)

**AuthProvider Component:**
- Wraps entire app
- Listens to auth state changes
- Provides session/user to all components
- Handles automatic session restoration

**Key Events:**
- `SIGNED_IN` - User logged in
- `SIGNED_OUT` - User logged out
- `TOKEN_REFRESHED` - Session refreshed
- `USER_UPDATED` - User data changed

### Server-Side

**Middleware:**
- Runs on every request
- Validates session from cookies
- Protects routes server-side
- Redirects unauthenticated users

**Server Components:**
- Use `createServerClient()` from `lib/supabase-server.ts`
- Read session from cookies
- Validate on each request

## 🔐 Security Features

### PKCE Flow
- **What:** Proof Key for Code Exchange
- **Why:** More secure than implicit flow
- **How:** Uses code challenge/verifier pair

### Automatic Token Refresh
- **What:** Refreshes access token before expiry
- **Why:** Keeps users logged in seamlessly
- **How:** Background refresh every ~50 minutes

### Session Detection in URL
- **What:** Detects auth tokens in URL parameters
- **Why:** Enables email verification flow
- **How:** Supabase SDK automatically extracts tokens

### Secure Storage
- **What:** Encrypted session storage
- **Why:** Protects sensitive auth data
- **How:** localStorage with Supabase encryption

## 📱 Component Usage

### Using Auth in Components

```typescript
import { useAuth } from '@/components/AuthProvider';

function MyComponent() {
  const { session, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please sign in</div>;
  }
  
  return <div>Hello {user.email}!</div>;
}
```

### Using Auth in Server Components

```typescript
import { createServerClient } from '@/lib/supabase-server';

export default async function ServerPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return <div>Hello {user.email}!</div>;
}
```

### Sign Out

```typescript
import { supabase } from '@/lib/supabase';

async function handleSignOut() {
  await supabase.auth.signOut();
  // onAuthStateChange will fire with SIGNED_OUT
  // User will be redirected automatically
}
```

## 🌐 URL Structure

### Auth Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `/sign-in` | Sign in page | Public |
| `/sign-up` | Sign up page | Public |
| `/auth/callback` | Email verification handler | Public |
| `/dashboard` | Protected dashboard | Authenticated only |

### Redirect Flow

```
Unauthenticated user → /dashboard
    ↓
Middleware intercepts
    ↓
Redirects to /sign-in
    ↓
User signs in
    ↓
Redirects to /dashboard
```

```
Authenticated user → /sign-in
    ↓
Middleware intercepts
    ↓
Redirects to /dashboard
```

## 🔧 Configuration Points

### 1. Supabase Client (`lib/supabase.ts`)
- Auth flow type
- Token refresh settings
- Session persistence
- Storage configuration

### 2. Callback Route (`app/auth/callback/route.ts`)
- Code exchange logic
- Redirect destinations
- Error handling

### 3. Middleware (`middleware.ts`)
- Protected routes
- Public routes
- Redirect logic

### 4. AuthProvider (`components/AuthProvider.tsx`)
- Global state management
- Auth event handling
- Session restoration

## 📝 Environment Variables

### Required

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### Where They're Used

- `lib/supabase.ts` - Client creation
- `lib/supabase-server.ts` - Server client
- `middleware.ts` - Request validation
- `app/auth/callback/route.ts` - Callback handler

## 🎯 Key Files Reference

| File | Purpose | Type |
|------|---------|------|
| `lib/supabase.ts` | Browser client | Client |
| `lib/supabase-server.ts` | Server client | Server |
| `components/AuthProvider.tsx` | Global auth state | Client |
| `app/auth/callback/route.ts` | Email verification | Server |
| `middleware.ts` | Route protection | Server |
| `app/sign-in/page.tsx` | Sign in UI | Client |
| `app/sign-up/page.tsx` | Sign up UI | Client |

## 🐛 Debugging Tips

### Check Session Status

```typescript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Check User Status

```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

### Listen to Auth Events

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});
```

### Check localStorage

```javascript
// In browser console
console.log(localStorage.getItem('supabase.auth.token'));
```

## 🔍 Common Scenarios

### Scenario 1: User Signs Up
1. User fills sign-up form
2. Email sent with verification link
3. User clicks link
4. Redirected to callback route
5. Session created
6. Redirected to dashboard
7. Session persists in localStorage

### Scenario 2: User Returns After 1 Day
1. User opens app
2. AuthProvider checks localStorage
3. Session found and valid
4. User auto-logged in
5. No sign-in required

### Scenario 3: User Returns After 7 Days
1. User opens app
2. AuthProvider checks localStorage
3. Session expired
4. Auto-refresh attempted
5. New session created
6. User stays logged in

### Scenario 4: User Signs Out
1. User clicks sign out
2. `supabase.auth.signOut()` called
3. Session cleared from localStorage
4. Cookies cleared
5. Auth state updated
6. User redirected to sign-in

## 📊 Session Lifecycle

```
Sign In
    ↓
Session Created (expires in 1 hour)
    ↓
Stored in localStorage
    ↓
Auto-refresh at 50 minutes
    ↓
New session created (expires in 1 hour)
    ↓
Repeat until sign out or 7 days pass
    ↓
After 7 days: Refresh token expires
    ↓
User must sign in again
```

## 🎓 Best Practices

1. **Always use AuthProvider** for client-side auth state
2. **Always use middleware** for route protection
3. **Never store sensitive data** in localStorage manually
4. **Always validate sessions** on the server
5. **Use server components** for sensitive data fetching
6. **Handle loading states** properly in UI
7. **Provide clear error messages** to users
8. **Test both flows** (with and without email verification)

## 🚨 Security Considerations

1. **HTTPS Only:** Always use HTTPS in production
2. **Secure Cookies:** Cookies are httpOnly and secure
3. **Token Rotation:** Tokens are automatically rotated
4. **PKCE Flow:** Prevents authorization code interception
5. **XSS Protection:** Supabase SDK handles token security
6. **CSRF Protection:** Built into Supabase auth flow

## 📚 Further Reading

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [PKCE Flow Explained](https://oauth.net/2/pkce/)

