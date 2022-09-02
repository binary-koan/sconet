import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  Resource,
  ResourceActions,
  useContext
} from "solid-js"

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

export function useMutation(
  mutation: string,
  { refetchQueries }: { refetchQueries?: string[] } = {}
) {
  const context = useContext(gqlContext)
  const [loading, setLoading] = createSignal(false)

  const mutate = async (variables: any) => {
    setLoading(true)
    await requestGraphql(JSON.stringify({ query: mutation, variables }))
    setLoading(false)

    refetchQueries?.forEach((query) => {
      Object.values(context.queries[query]).forEach(({ listeners }) =>
        listeners?.forEach((listener) => listener.refetch())
      )
    })
  }

  return [
    mutate,
    {
      get loading() {
        return loading()
      }
    }
  ]
}

async function requestGraphql<Result>(body: string): Promise<Result> {
  const response = await fetch("http://localhost:4444/graphql", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjIwMTQxOTgsImV4cCI6MTY2MzIyMzc5OCwic3ViIjoiNjMxMDUyZjIxNTBhZDkxN2E4NWI0ODc1In0.exaTIuLY8US6p1a33MNrpalJr06KlJYrhIslAA2jXkM"
    }
  })

  const { data, errors } = await response.json()

  if (errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(errors)}`)
  }

  return data
}
