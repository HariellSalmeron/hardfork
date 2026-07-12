import { supabase, isSupabaseConfigured } from './supabaseClient'
import type { AuthError, User } from '@supabase/supabase-js'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

const DEMO_USER_STORAGE_KEY = 'hardfork-demo-user'

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  return window.localStorage
}

function getStoredDemoUser(): User | null {
  const storage = getStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(DEMO_USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) as User : null
  } catch {
    return null
  }
}

function setStoredDemoUser(user: User | null) {
  const storage = getStorage()
  if (!storage) return
  if (user) {
    storage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    storage.removeItem(DEMO_USER_STORAGE_KEY)
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hardfork-auth-state-changed'))
  }
}

function createDemoUser(email: string): User {
  const timestamp = new Date().toISOString()
  return {
    id: `demo-${email.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}`,
    email,
    created_at: timestamp,
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: { provider: 'demo' },
    user_metadata: {},
  } as User
}

function isFallbackAuthError(error: unknown): boolean {
  if (!error) return false
  const message = typeof error === 'string'
    ? error
    : typeof (error as { message?: string }).message === 'string'
      ? (error as { message?: string }).message
      : ''
  return /failed to fetch|fetch failed|enotfound|network|offline/i.test(message || '')
}

function fallbackLogin(email: string): AuthResponse {
  const demoUser = createDemoUser(email)
  setStoredDemoUser(demoUser)
  return { user: demoUser, error: null }
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    return fallbackLogin(email)
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (data?.user) {
      setStoredDemoUser(data.user)
    }
    return { user: data?.user || null, error }
  } catch (error) {
    if (isFallbackAuthError(error)) {
      return fallbackLogin(email)
    }
    return { user: null, error: error as AuthError }
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    return fallbackLogin(email)
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      if (isFallbackAuthError(error)) {
        return fallbackLogin(email)
      }
      return { user: null, error }
    }
    if (data?.user) {
      setStoredDemoUser(data.user)
    }
    return { user: data?.user || null, error }
  } catch (error) {
    if (isFallbackAuthError(error)) {
      return fallbackLogin(email)
    }
    return { user: null, error: error as AuthError }
  }
}

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { url: data?.url, error }
  } catch (error) {
    return { url: null, error: error as AuthError }
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  setStoredDemoUser(null)
  if (!isSupabaseConfigured) {
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const storedDemoUser = getStoredDemoUser()
  if (storedDemoUser) {
    return storedDemoUser
  }

  if (!isSupabaseConfigured) {
    return null
  }

  try {
    const { data } = await supabase.auth.getUser()
    return data?.user || null
  } catch {
    return null
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
) {
  const storedDemoUser = getStoredDemoUser()
  if (storedDemoUser) {
    callback(storedDemoUser)
  }

  if (!isSupabaseConfigured) {
    return { unsubscribe: () => undefined }
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      callback(session?.user || null)
    }
  )
  return subscription
}

/**
 * Reset password with email
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { user: data?.user || null, error }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}
