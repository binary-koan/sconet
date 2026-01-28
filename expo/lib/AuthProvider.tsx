import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useRouter, useSegments, useRootNavigationState } from "expo-router"
import { isLoggedIn, clearAuth } from "./auth"
import { setAuthErrorCallback } from "./apollo"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {}
})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()
  const navigationState = useRootNavigationState()

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Set up the auth error callback
  useEffect(() => {
    setAuthErrorCallback(() => {
      setIsAuthenticated(false)
    })
  }, [])

  const checkAuth = async () => {
    try {
      const loggedIn = await isLoggedIn()
      setIsAuthenticated(loggedIn)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle navigation based on auth state
  useEffect(() => {
    if (!navigationState?.key || isLoading) return

    const inAuthGroup = segments[0] === "login"

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not on login page
      router.replace("/login")
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to transactions if authenticated and on login page
      router.replace("/transactions")
    }
  }, [isAuthenticated, segments, isLoading, navigationState?.key])

  const signOut = useCallback(async () => {
    await clearAuth()
    setIsAuthenticated(false)
    router.replace("/login")
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
