import { createEffect, createMemo, createSignal, onCleanup, useContext } from "solid-js"
import { gqlContext } from "./context.ts"
import { FetchMore, StoredQuery, listenToQuery } from "./listenToQuery.ts"

export interface QueryResource<Data, Variables> {
  (): Data | undefined
  loading: boolean
  error?: any

  refetch: () => void
  fetchMore: FetchMore<Data, Variables>
}

export function useQuery<Data, Variables = Record<string, never>>(
  queryContent: string,
  variables?: () => Variables
): QueryResource<Data, Variables> {
  const context = useContext(gqlContext)

  const queryParam = () => queryContent
  const variablesParam = () => JSON.stringify(variables?.() || {})

  const [storedQuery, setStoredQuery] = createSignal<StoredQuery<Data>>()
  const data = createMemo(() => storedQuery()?.get())

  createEffect(() => {
    const query = listenToQuery<Data>(context, queryParam(), variablesParam())

    setStoredQuery(query)

    onCleanup(() => {
      query.removeListener()
    })
  })

  const resource = () => data()

  // eslint-disable-next-line solid/reactivity
  Object.defineProperties(resource, {
    loading: {
      get: () => storedQuery()?.loading ?? true
    },

    error: {
      get: () => storedQuery()?.error ?? undefined
    }
  })

  // eslint-disable-next-line solid/reactivity
  resource.fetchMore = (...args: Parameters<FetchMore<Data, Variables>>) =>
    storedQuery()?.fetchMore(...args)

  // eslint-disable-next-line solid/reactivity
  resource.refetch = () => storedQuery()?.refetch()

  return resource as any
}
