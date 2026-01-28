import { ApolloProvider } from "@apollo/client/react"
import { PortalHost } from "@rn-primitives/portal"
import { Stack } from "expo-router"
import { apolloClient } from "../lib/apollo"
import { AuthProvider } from "../lib/AuthProvider"
import "./global.css"

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Stack />
        <PortalHost />
      </AuthProvider>
    </ApolloProvider>
  )
}
