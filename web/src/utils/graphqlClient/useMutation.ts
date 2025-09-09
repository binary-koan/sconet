import { isObject } from "lodash"
import { createSignal, useContext } from "solid-js"
import toast from "solid-toast"
import { gqlContext } from "./context.ts"
import { requestGraphql } from "./requestGraphql.ts"

export interface MutationOptions<Data> {
  refetchQueries?: string[] | "ALL"
  onSuccess?: (data: Data) => void
  onError?: (error: any) => void
}

export interface MutationFunction<Data, Variables> {
  (variables: Variables): Promise<Data | undefined>
  loading: boolean
}

export function useMutation<Data, Variables>(
  mutation: string,
  { refetchQueries, onSuccess, onError }: MutationOptions<Data> = {}
): MutationFunction<Data, Variables> {
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

      return data
    } catch (error) {
      console.error(error)
      if (onError) {
        onError(error)
      } else {
        toast.error(
          isObject(error) && "message" in error ? `${error.message}` : "An API error occurred"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  Object.defineProperty(mutate, "loading", {
    get() {
      return loading()
    }
  })

  return mutate as MutationFunction<Data, Variables>
}
