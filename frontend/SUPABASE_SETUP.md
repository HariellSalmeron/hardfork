# Supabase Integration Setup Guide

## ✅ What Has Been Set Up

1. **Supabase Client** (`src/lib/supabaseClient.ts`)
   - Initializes Supabase with your credentials

2. **Authentication Functions** (`src/lib/auth.ts`)
   - `signUp()` - Register new users
   - `signIn()` - Login with email/password
   - `signOut()` - Logout
   - `getCurrentUser()` - Get current user
   - `onAuthStateChange()` - Listen to auth changes
   - `resetPassword()` - Password reset
   - `updatePassword()` - Update password
   - `signInWithOAuth()` - Social login (Google, GitHub, etc.)

3. **Auth Context & Provider** (`src/context/AuthContext.tsx`)
   - `AuthProvider` - Wraps your app with auth state
   - `useAuth()` - Hook to access user and loading state

4. **Protected Route Component** (`src/components/ProtectedRoute.tsx`)
   - Protects pages that require authentication

5. **Updated LoginPage** (`src/components/LoginPage.tsx`)
   - Email/password login
   - Password reset functionality
   - Error/success messaging
   - Remember me checkbox
   - Loading states

6. **Updated App Component** (`src/App.tsx`)
   - Wrapped with `AuthProvider`

## 🚀 Getting Started

### Step 1: Create a Supabase Account
1. Go to https://supabase.com
2. Sign up with your email
3. Create a new project
4. Wait for project to initialize

### Step 2: Get Your Credentials
1. Go to **Settings → API** in your Supabase dashboard
2. Copy your **Project URL** and **anon (public) key**

### Step 3: Set Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Replace the values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

### Step 4: Start Your Dev Server
```bash
npm run dev
```

## 📱 Using Authentication in Components

### Get Current User
```tsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

### Protect Routes
```tsx
import { ProtectedRoute } from '../components/ProtectedRoute'
import Dashboard from '../pages/Dashboard'

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

### Use Auth Functions
```tsx
import { signIn, signOut } from '../lib/auth'

async function handleLogin(email: string, password: string) {
  const { user, error } = await signIn(email, password)
  if (error) {
    console.error('Login failed:', error.message)
  } else {
    console.log('Logged in as:', user?.email)
  }
}
```

## 🔐 Setting Up Database Tables

After logging in to Supabase, you can create tables:

1. Go to the **SQL Editor**
2. Create tables for your data (users are auto-created by Auth)
3. Example: Create a `profiles` table:
   ```sql
   create table profiles (
     id uuid references auth.users on delete cascade,
     username text,
     full_name text,
     avatar_url text,
     bio text,
     created_at timestamp default now(),
     primary key (id)
   );
   ```

## 🔑 Security Best Practices

- ✅ The `anon key` is safe to expose (it's already in `.env.local`)
- ⚠️ Never expose the `service_role key` - keep it server-side only
- ✅ Supabase RLS (Row Level Security) protects your data
- ✅ Set RLS policies on your tables

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [React Integration](https://supabase.com/docs/guides/auth/social-oauth/auth-google)

## 🐛 Troubleshooting

**"Missing Supabase configuration"**
- Make sure `.env.local` exists with correct values
- Restart your dev server after updating `.env.local`

**"Login not working"**
- Verify credentials in Supabase dashboard
- Check browser console for detailed error messages
- Make sure user exists or enable sign-ups

**"Password reset not working"**
- Check email configuration in Supabase → Authentication → Email Templates
- Verify email deliverability settings
