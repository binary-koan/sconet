import { createEffect, createMemo, useContext } from "solid-js"
import { gqlContext } from "./context"
import { FetchMore, listenToQuery } from "./listenToQuery"

export interface QueryResource<Data, Variables> {
  (): Data | undefined
  loading: boolean
  error?: any

  refetch: () => void
  fetchMore: FetchMore<Data, Variables>
}

export function useQuery<Data, Variables = {}>(
  queryContent: string,
  variables?: () => Variables
): QueryResource<Data, Variables> {
  const context = useContext(gqlContext)

  const queryParam = () => queryContent
  const variablesParam = () => JSON.stringify(variables?.() || {})

  // Memory leak: This creates a new store for each variable change and probably never cleans up the old ones ...
  const storedQuery = createMemo(() => listenToQuery(context, queryParam(), variablesParam()))

  const data = createMemo(() => storedQuery().get())

  createEffect(() => {
    const query = storedQuery()
    return () => query.removeListener()
  })

  const resource = () => data()

  Object.defineProperties(resource, {
    loading: {
      get: () => storedQuery().loading
    },

    error: {
      get: () => storedQuery().error
    }
  })

  resource.fetchMore = (...args: Parameters<FetchMore<Data, Variables>>) =>
    storedQuery().fetchMore(...args)
  resource.refetch = () => storedQuery().refetch()

  return resource as any
}
