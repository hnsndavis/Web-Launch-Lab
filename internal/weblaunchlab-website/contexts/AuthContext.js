import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/database'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile with role
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('email', session.user.email)
            .single()

          setUser({
            ...session.user,
            role: profile?.role || 'client'
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Get user profile with role
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('email', session.user.email)
          .single()

        setUser({
          ...session.user,
          role: profile?.role || 'client'
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single()

      const userData = {
        ...data.user,
        role: profile?.role || 'client'
      }

      setUser(userData)

      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}