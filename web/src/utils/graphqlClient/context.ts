import { createContext } from "solid-js"
import { GraphQLContext } from "./listenToQuery.ts"

export const gqlContext = createContext<GraphQLContext>({
  queries: {}
})
