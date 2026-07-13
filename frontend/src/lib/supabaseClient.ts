import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

function isPlaceholderValue(value?: string) {
  return !value || value.includes('your-project') || value.includes('your-anon-public-key') || value.includes('replace-me')
}

export const isSupabaseConfigured = !isPlaceholderValue(supabaseUrl) && !isPlaceholderValue(supabaseAnonKey)

function createFallbackClient(): SupabaseClient {
  const fallback = {
    auth: {
      signUp: async () => ({ data: { user: null }, error: { message: 'Missing Supabase configuration.' } }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Missing Supabase configuration.' } }),
      signInWithOAuth: async () => ({ data: null, error: { message: 'Missing Supabase configuration.' } }),
      signOut: async () => ({ error: { message: 'Missing Supabase configuration.' } }),
      getUser: async () => ({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      updateUser: async () => ({ data: { user: null }, error: { message: 'Missing Supabase configuration.' } }),
      resetPasswordForEmail: async () => ({ error: { message: 'Missing Supabase configuration.' } }),
    },
  }
  return fallback as unknown as SupabaseClient
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackClient()
