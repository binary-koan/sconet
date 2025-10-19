import { isObject } from "lodash"
import { createSignal, useContext } from "solid-js"
import toast from "solid-toast"
import { gqlContext } from "./context"
import { requestGraphql, FileInfo } from "./requestGraphql"

export interface MutationOptions<Data> {
  refetchQueries?: string[] | "ALL"
  onSuccess?: (data: Data) => void
  onError?: (error: any) => void
}

export interface MutationFunction<Data, Variables> {
  (variables: Variables): Promise<Data | undefined>
  loading: boolean
}

function extractFiles(variables: any): {
  files: FileInfo[]
  cleanedVariables: any
} {
  const files: FileInfo[] = []

  function processValue(value: any, path: string): any {
    if (value instanceof File) {
      files.push({ file: value, path })
      return null
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => processValue(item, `${path}.${index}`))
    }

    if (value !== null && typeof value === "object") {
      const result: any = {}
      for (const [key, val] of Object.entries(value)) {
        result[key] = processValue(val, path ? `${path}.${key}` : key)
      }
      return result
    }

    return value
  }

  const cleanedVariables = processValue(variables, "variables")

  return {
    files,
    cleanedVariables
  }
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

      const { files, cleanedVariables } = extractFiles(variables)
      const serializedVariables = JSON.stringify(cleanedVariables)

      const data = await requestGraphql<Data>(mutation, serializedVariables, files)
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
