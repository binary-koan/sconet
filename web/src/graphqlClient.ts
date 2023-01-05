import { createContext, createMemo, createSignal, useContext } from "solid-js"
import { createStore, reconcile } from "solid-js/store"
import { loginToken } from "./utils/auth"

interface StoredQuery<Data> {
  inflightRequest?: Promise<any>

  get(): Data | undefined
  set(data: Data): void

  loading: boolean
  error: any

  fetch(): Promise<any>
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
    loading: false,
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
        storedQuery.inflightRequest = requestGraphql<Data>(query, serializedVariables)
          .then((data) => {
            delete storedQuery.inflightRequest

            storedQuery.set(data)
          })
          .catch((error) => {
            setStore("error", error)
          })
      }

      return await storedQuery!.inflightRequest
    },

    async refetch() {
      delete storedQuery.inflightRequest

      storedQuery.fetch()
    }
  }

  context.queries[query] ??= {}
  context.queries[query][serializedVariables] ??= storedQuery

  return context.queries[query][serializedVariables]
}

export interface QueryResource<Data, Variables> {
  (): Data | undefined
  loading: boolean
  error?: any

  refetch: () => void
  fetchMore: (variables: Variables, merge: (existingData: Data, newData: Data) => Data) => void
}

export function useQuery<Data, Variables = {}>(
  queryContent: string,
  variables?: () => Variables
): QueryResource<Data, Variables> {
  const context = useContext(gqlContext)

  const queryParam = () => queryContent
  const variablesParam = () => JSON.stringify(variables?.() || {})

  const storedQuery = createMemo(() => getQuery(context, queryParam(), variablesParam()))
  const data = createMemo(() => storedQuery().get())

  if (!storedQuery().get()) storedQuery().fetch()

  const resource = () => data()

  Object.defineProperties(resource, {
    loading: {
      get: () => storedQuery().loading
    },

    error: {
      get: () => storedQuery().error
    }
  })

  resource.refetch = () => storedQuery().refetch()

  resource.fetchMore = () => {}

  // return [
  //   data,

  //   {
  //     refetch: () => {
  //       storedQuery().refetch()
  //     },

  //     fetchMore: (variables, merge) => {
  //       // const { state } = queryState(context, queryParam(), variablesParam())
  //       // if (!state.cache) {
  //       //   throw new Error("Cannot fetchMore when the first result is not yet loaded")
  //       // }
  //       // state.inflightRequest = requestGraphql<Data>(queryParam(), JSON.stringify(variables)).then(
  //       //   (newData) => {
  //       //     if (!state.inflightRequest) {
  //       //       // Something has changed in the meantime, we should cancel this
  //       //       return
  //       //     }
  //       //     if (!state.cache) {
  //       //       throw new Error("Cannot fetchMore when the first result is not yet loaded")
  //       //     }
  //       //     state.cache = merge(state.cache, newData)
  //       //     delete state.inflightRequest
  //       //     return state.cache
  //       //   }
  //       // )
  //     }
  //   }
  // ]

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

  const response = await fetch("http://localhost:4444/graphql", {
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
