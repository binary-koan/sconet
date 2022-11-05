import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  Resource,
  ResourceActions,
  useContext
} from "solid-js"
import { loginToken } from "./utils/auth"

const gqlContext = createContext<{
  queries: {
    [query: string]: {
      [variables: string]: {
        cache?: any
        inflightRequest?: Promise<any>
        listeners?: Set<ResourceActions<any>>
      }
    }
  }
}>({
  queries: {}
})

export interface QueryActions<Data, Variables> {
  refetch: () => void
  fetchMore: (variables: Variables, merge: (existingData: Data, newData: Data) => Data) => void
}

export function useQuery<Data, Variables = {}>(
  query: string,
  variables?: () => Variables
): [Resource<Data>, QueryActions<Data, Variables>] {
  const context = useContext(gqlContext)

  const queryParam = () => JSON.stringify(query)
  const variablesParam = () => JSON.stringify(variables?.() || {})

  const [data, actions] = createResource<Data, [string, string]>(
    () => [queryParam(), variablesParam()] as [string, string],
    async ([queryParam, variablesParam]) => {
      context.queries[queryParam] ??= {}
      context.queries[queryParam][variablesParam] ??= {}

      if (context.queries[queryParam][variablesParam].cache) {
        return context.queries[queryParam][variablesParam].cache
      }

      if (!context.queries[queryParam][variablesParam].inflightRequest) {
        context.queries[queryParam][variablesParam].inflightRequest = requestGraphql<Data>(
          `{"query":${queryParam},"variables":${variablesParam}}`
        ).then((data) => {
          context.queries[queryParam][variablesParam].cache = data
          delete context.queries[queryParam][variablesParam].inflightRequest
          return data
        })
      }

      return await context.queries[queryParam][variablesParam].inflightRequest
    }
  )

  let lastRequest: { queryParam: string; variablesParam: string } | undefined

  createEffect(() => {
    if (lastRequest) {
      context.queries[lastRequest.queryParam][lastRequest.variablesParam].listeners?.delete(actions)
    }

    context.queries[queryParam()][variablesParam()].listeners ??= new Set()
    context.queries[queryParam()][variablesParam()].listeners!.add(actions)
  })

  return [
    data,
    {
      refetch: () => {
        delete context.queries[queryParam()][variablesParam()].cache
        delete context.queries[queryParam()][variablesParam()].inflightRequest

        context.queries[queryParam()][variablesParam()].listeners?.forEach((listener) =>
          listener.refetch()
        )
      },

      fetchMore: (variables, merge) => {
        if (!context.queries[queryParam()][variablesParam()].cache) {
          throw new Error("Cannot fetchMore when the first result is not yet loaded")
        }

        context.queries[queryParam()][variablesParam()].inflightRequest = requestGraphql<Data>(
          `{"query":${queryParam()},"variables":${JSON.stringify(variables)}}`
        ).then((newData) => {
          if (!context.queries[queryParam()][variablesParam()].inflightRequest) {
            // Something has changed in the meantime, we should cancel this
            return
          }

          if (!context.queries[queryParam()][variablesParam()].cache) {
            throw new Error("Cannot fetchMore when the first result is not yet loaded")
          }

          context.queries[queryParam()][variablesParam()].cache = merge(
            context.queries[queryParam()][variablesParam()].cache,
            newData
          )
          delete context.queries[queryParam()][variablesParam()].inflightRequest
          return data
        })
      }
    }
  ]
}

export interface MutationOptions<Data> {
  refetchQueries?: string[] | "ALL"
  onSuccess?: (data: Data) => void
  onError?: (error: any) => void
}

export function useMutation<Data, Variables>(
  mutation: string,
  { refetchQueries, onSuccess, onError }: MutationOptions<Data> = {}
) {
  const context = useContext(gqlContext)
  const [loading, setLoading] = createSignal(false)

  const mutate = async (variables: Variables) => {
    try {
      setLoading(true)
      const data = await requestGraphql<Data>(JSON.stringify({ query: mutation, variables }))
      setLoading(false)
      onSuccess?.(data)

      const refetchList = refetchQueries === "ALL" ? Object.keys(context.queries) : refetchQueries

      refetchList?.forEach((query) => {
        Object.values(context.queries[query] || {}).forEach(({ listeners }) =>
          listeners?.forEach((listener) => listener.refetch())
        )
      })
    } catch (error) {
      console.error(error)
      onError?.(error)
    }
  }

  return [
    mutate,
    {
      get loading() {
        return loading()
      }
    }
  ] as const
}

async function requestGraphql<Result>(body: string): Promise<Result> {
  const token = loginToken()

  const response = await fetch("http://localhost:4444/graphql", {
    method: "POST",
    body,
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
