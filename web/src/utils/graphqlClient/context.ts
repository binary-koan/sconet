import { createContext } from "solid-js"
import { GraphQLContext } from "./listenToQuery"

export const gqlContext = createContext<GraphQLContext>({
  queries: {}
})
