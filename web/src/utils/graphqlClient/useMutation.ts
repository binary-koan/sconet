import { createSignal, useContext } from "solid-js"
import { gqlContext } from "./context"
import { requestGraphql } from "./requestGraphql"

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
