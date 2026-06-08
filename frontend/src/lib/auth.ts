import { supabase } from './supabaseClient'
import type { AuthError, User } from '@supabase/supabase-js'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { user: data?.user || null, error }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data?.user || null, error }
  } catch (error) {
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
