import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  Resource,
  ResourceActions,
  useContext
} from "solid-js"
import { loginToken } from "./utils/auth"

interface QueryState {
  cache?: any
  inflightRequest?: Promise<any>
}

interface StoredQuery {
  get(): Promise<any>
  fetch(): Promise<any>
  refetch(): void
  listeners: Set<ResourceActions<any>>
  state: QueryState
}

interface GraphQLContext {
  queries: {
    [query: string]: {
      [variables: string]: StoredQuery
    }
  }
}

const gqlContext = createContext<GraphQLContext>({
  queries: {}
})

const queryState = <Data>(context: GraphQLContext, query: string, serializedVariables: string) => {
  let state: StoredQuery | undefined = context.queries[query]?.[serializedVariables]

  if (!state) {
    const state: QueryState = {}
    const listeners: Set<ResourceActions<any>> = new Set()

    const fetch = async () => {
      if (!state?.inflightRequest) {
        // TODO: Errors here don't go to the createResource error state correctly (hence ErrorBoundary in Cell)
        state!.inflightRequest = requestGraphql<Data>(query, serializedVariables).then((data) => {
          state!.cache = data
          delete state!.inflightRequest

          return data
        })
      }

      return await state!.inflightRequest
    }

    const get = () => {
      return state.cache || fetch()
    }

    const refetch = () => {
      delete state.inflightRequest

      fetch().then((data) => listeners.forEach((listener) => listener.mutate(data)))
    }

    context.queries[query] ??= {}
    context.queries[query][serializedVariables] ??= {
      listeners,
      get,
      fetch,
      refetch,
      state
    }
  }

  return context.queries[query][serializedVariables]
}
export interface QueryActions<Data, Variables> {
  refetch: () => void
  fetchMore: (variables: Variables, merge: (existingData: Data, newData: Data) => Data) => void
}

export function useQuery<Data, Variables = {}>(
  queryContent: string,
  variables?: () => Variables
): [Resource<Data>, QueryActions<Data, Variables>] {
  const context = useContext(gqlContext)

  const queryParam = () => queryContent
  const variablesParam = () => JSON.stringify(variables?.() || {})

  const [data, actions] = createResource<Data, [string, string]>(
    () => [queryParam(), variablesParam()] as [string, string],
    async ([queryParam, variablesParam]) => {
      return queryState(context, queryParam, variablesParam).get()
    }
  )

  createEffect(() => {
    const query = queryParam()
    const variables = variablesParam()

    context.queries[query][variables].listeners.add(actions)

    onCleanup(() => {
      context.queries[query][variables].listeners.delete(actions)
    })
  })

  return [
    data,
    {
      refetch: () => {
        queryState(context, queryParam(), variablesParam()).refetch()
      },

      fetchMore: (variables, merge) => {
        const { state } = queryState(context, queryParam(), variablesParam())

        if (!state.cache) {
          throw new Error("Cannot fetchMore when the first result is not yet loaded")
        }

        state.inflightRequest = requestGraphql<Data>(queryParam(), JSON.stringify(variables)).then(
          (newData) => {
            if (!state.inflightRequest) {
              // Something has changed in the meantime, we should cancel this
              return
            }

            if (!state.cache) {
              throw new Error("Cannot fetchMore when the first result is not yet loaded")
            }

            state.cache = merge(state.cache, newData)
            delete state.inflightRequest
            return data
          }
        )
      }
    }
  ]
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
