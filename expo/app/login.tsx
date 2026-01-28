import { useState, useEffect } from "react"
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLoginMutation } from "@/lib/graphql/mutations"
import { setLoginToken, getLastUserEmail } from "@/lib/auth"

export default function LoginScreen() {
  const router = useRouter()
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
        variables: { email: email.trim(), password },
      })

      if (result.data?.login.user) {
        const { token, email: userEmail } = result.data.login.user
        await setLoginToken(token, userEmail)
        router.replace("/transactions")
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Please try again."
      setErrorMessage(message)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-body-bg"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-8">
            <Text className="text-center text-3xl font-bold text-foreground">
              Sconet
            </Text>
            <Text className="mt-2 text-center text-muted">
              Sign in to your account
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="mb-1.5 text-sm font-medium text-foreground">
                Email
              </Text>
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
              <Text className="mb-1.5 text-sm font-medium text-foreground">
                Password
              </Text>
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
              <Text className="text-center text-sm text-destructive">
                {errorMessage}
              </Text>
            )}

            <Button
              onPress={handleLogin}
              disabled={loading}
              className="mt-2"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text>Sign In</Text>
              )}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}
