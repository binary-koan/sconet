import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { getLastUserEmail, setLoginToken } from "@/lib/auth"
import { useAuth } from "@/lib/AuthProvider"
import { useLoginMutation } from "@/lib/graphql/mutations"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from "react-native"

export default function LoginScreen() {
  const { refreshAuth } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [login, { loading }] = useLoginMutation()

  useEffect(() => {
    getLastUserEmail().then((lastEmail) => {
      if (lastEmail) setEmail(lastEmail)
    })
  }, [])

  const handleLogin = async () => {
    setErrorMessage(null)

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter your email and password")
      return
    }

    try {
      const result = await login({
        variables: { email: email.trim(), password }
      })

      if (result.data?.login.user) {
        const { token, email: userEmail } = result.data.login.user
        await setLoginToken(token, userEmail)
        await refreshAuth()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again."
      setErrorMessage(message)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign In",
          headerShown: false
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="bg-body-bg flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-8">
            <Text className="text-foreground text-center text-3xl font-bold">Sconet</Text>
            <Text className="text-muted-foreground mt-2 text-center">Sign in to your account</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-foreground mb-1.5 text-sm font-medium">Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View>
              <Text className="text-foreground mb-1.5 text-sm font-medium">Password</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
                onSubmitEditing={handleLogin}
              />
            </View>

            {errorMessage && (
              <Text className="text-destructive text-center text-sm">{errorMessage}</Text>
            )}

            <Button onPress={handleLogin} disabled={loading} className="mt-2">
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text>Sign In</Text>}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}
