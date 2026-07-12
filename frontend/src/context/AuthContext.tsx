import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { onAuthStateChange, getCurrentUser } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabaseClient'

interface AuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      const currentUser = await getCurrentUser()
      if (!isMounted) return
      setUser(currentUser)
      setLoading(false)
    }

    initializeAuth()

    const subscription = onAuthStateChange((currentUser) => {
      if (!isMounted) return
      setUser(currentUser)
      setLoading(false)
    })

    const handleAuthStateChanged = () => {
      void initializeAuth()
    }

    window.addEventListener('hardfork-auth-state-changed', handleAuthStateChanged)

    return () => {
      isMounted = false
      subscription?.unsubscribe()
      window.removeEventListener('hardfork-auth-state-changed', handleAuthStateChanged)
    }
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="config-error">
        <h1>Supabase configuration is missing</h1>
        <p>Please copy <code>.env.local.example</code> to <code>.env.local</code> and set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured: isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
