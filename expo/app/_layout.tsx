import { ApolloProvider } from "@apollo/client/react"
import { PortalHost } from "@rn-primitives/portal"
import { Stack } from "expo-router"
import { apolloClient } from "../lib/apollo"
import { AuthProvider } from "../lib/AuthProvider"
import "./global.css"
import { useCSSVariable } from "uniwind"

export default function RootLayout() {
  const [backgroundColor, foregroundColor] = useCSSVariable([
    "--color-background",
    "--color-foreground"
  ])

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor },
            headerTintColor: foregroundColor
          }}
        />
        <PortalHost />
      </AuthProvider>
    </ApolloProvider>
  )
}
