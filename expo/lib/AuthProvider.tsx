import { useRootNavigationState, useRouter, useSegments } from "expo-router"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { setAuthErrorCallback } from "./apollo"
import { clearAuth, isLoggedIn } from "./auth"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  refreshAuth: async () => {}
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

  const checkAuth = useCallback(async () => {
    try {
      const loggedIn = await isLoggedIn()
      setIsAuthenticated(loggedIn)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle navigation based on auth state
  useEffect(() => {
    if (!navigationState?.key || isLoading) return

    const currentSegment = segments[0]
    const onLoginPage = currentSegment === "login"
    const onIndexPage = !currentSegment // index page has no segment

    if (!isAuthenticated && !onLoginPage) {
      // Redirect to login if not authenticated and not on login page
      router.replace("/login")
    } else if (isAuthenticated && (onLoginPage || onIndexPage)) {
      // Redirect to transactions if authenticated and on login or index page
      router.replace("/(tabs)/transactions")
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
        signOut,
        refreshAuth: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
