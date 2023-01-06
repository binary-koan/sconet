import { createContext, createMemo, createSignal, useContext } from "solid-js"
import { createStore, reconcile } from "solid-js/store"
import { loginToken } from "./utils/auth"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4444" : ""

type FetchMore<Data, Variables> = (
  variables: Variables,
  merge: (existingData: Data, newData: Data) => Data
) => void

interface StoredQuery<Data> {
  inflightRequest?: Promise<any>

  get(): Data | undefined
  set(data: Data): void

  loading: boolean
  error: any

  fetch(): Promise<any>
  fetchMore: FetchMore<any, any>
  refetch(): void
}

interface GraphQLContext {
  queries: {
    [query: string]: {
      [variables: string]: StoredQuery<any>
    }
  }
}

const gqlContext = createContext<GraphQLContext>({
  queries: {}
})

const getQuery = <Data>(context: GraphQLContext, query: string, serializedVariables: string) => {
  let existing: StoredQuery<Data> | undefined = context.queries[query]?.[serializedVariables]

  if (existing) {
    return existing
  }

  const [store, setStore] = createStore<{ data?: Data; loading: boolean; error?: any }>({
    data: undefined,
    loading: true,
    error: undefined
  })

  const storedQuery: StoredQuery<Data> = {
    get: () => store.data,
    set: (newData) => setStore("data", reconcile(newData)),

    get loading() {
      return store.loading
    },

    get error() {
      return store.error
    },

    async fetch() {
      if (!storedQuery.inflightRequest) {
        if (!store.data) {
          setStore("loading", true)
        }

        storedQuery.inflightRequest = requestGraphql<Data>(query, serializedVariables)
          .then((data) => {
            delete storedQuery.inflightRequest

            storedQuery.set(data)
          })
          .catch((error) => {
            setStore("error", error)
          })
          .finally(() => {
            setStore("loading", false)
          })
      }

      return await storedQuery!.inflightRequest
    },

    async fetchMore(variables, merge) {
      if (!store.data) {
        throw new Error("Cannot fetchMore when the first result is not yet loaded")
      }

      storedQuery.inflightRequest = requestGraphql<Data>(query, JSON.stringify(variables))
        .then((newData) => {
          if (!storedQuery.inflightRequest) {
            // Something has changed in the meantime, we should cancel this
            return
          }

          if (!store.data) {
            throw new Error("Cannot fetchMore when the first result is not yet loaded")
          }

          delete storedQuery.inflightRequest

          storedQuery.set(merge(store.data, newData))
        })
        .catch((error) => {
          setStore("error", error)
        })
    },

    async refetch() {
      delete storedQuery.inflightRequest

      storedQuery.fetch()
    }
  }

  context.queries[query] ??= {}
  context.queries[query][serializedVariables] = storedQuery

  storedQuery.fetch()

  return storedQuery
}

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
  const storedQuery = createMemo(() => getQuery(context, queryParam(), variablesParam()))

  const data = createMemo(() => storedQuery().get())

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

export interface MutationOptions<Data> {
  refetchQueries?: string[] | "ALL"
  onSuccess?: (data: Data) => void
  onError?: (error: any) => void
}

export interface MutationFunction<Variables> {
  (variables: Variables): Promise<void>
  loading: boolean
}

export function useMutation<Data, Variables>(
  mutation: string,
  { refetchQueries, onSuccess, onError }: MutationOptions<Data> = {}
): MutationFunction<Variables> {
  const context = useContext(gqlContext)
  const [loading, setLoading] = createSignal(false)

  const mutate = async (variables: Variables) => {
    try {
      setLoading(true)
      const data = await requestGraphql<Data>(mutation, JSON.stringify(variables))
      onSuccess?.(data)

      const refetchList = refetchQueries === "ALL" ? Object.keys(context.queries) : refetchQueries

      refetchList?.forEach((query) => {
        Object.values(context.queries[query] || {}).forEach(({ refetch }) => refetch())
      })
    } catch (error) {
      console.error(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  Object.defineProperty(mutate, "loading", {
    get() {
      return loading()
    }
  })

  return mutate as MutationFunction<Variables>
}

async function requestGraphql<Result>(query: string, serializedVariables: string): Promise<Result> {
  const token = loginToken()

  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    body: `{"query":${JSON.stringify(query)},"variables":${serializedVariables}}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    }
  })

  const { data, errors } = await response.json()

  if (errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(errors)}`)
  }

  return data
}
