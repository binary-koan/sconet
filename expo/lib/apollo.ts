import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"
import { ErrorLink } from "@apollo/client/link/error"
import { CombinedGraphQLErrors } from "@apollo/client/errors"
import { getLoginToken, clearAuth } from "./auth"

// TODO: Configure the actual GraphQL endpoint URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3030/graphql"

const httpLink = new HttpLink({ uri: API_URL })

// Add auth header to all requests
const authLink = setContext(async (_, { headers }) => {
  const token = await getLoginToken()
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})

// Callback to be set by AuthProvider for handling auth errors
let authErrorCallback: (() => void) | null = null

export function setAuthErrorCallback(callback: () => void) {
  authErrorCallback = callback
}

// Error handling link - detects auth errors and triggers redirect
export const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.extensions?.code === "UNAUTHENTICATED" || err.extensions?.code === "UNAUTHORIZED") {
        // Clear the token and trigger redirect
        clearAuth()
        if (authErrorCallback) {
          authErrorCallback()
        }
      }
    }
  } else {
    console.error(`[Network error]: ${error}`)
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
})
