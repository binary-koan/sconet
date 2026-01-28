import { View, ActivityIndicator } from "react-native"
import { useAuth } from "@/lib/AuthProvider"

export default function Index() {
  const { isLoading } = useAuth()

  // Show loading while checking auth state
  // AuthProvider will handle redirecting to login or transactions
  if (isLoading) {
    return (
      <View className="bg-body-bg flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  // AuthProvider will redirect, this is just a fallback
  return (
    <View className="bg-body-bg flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  )
}
