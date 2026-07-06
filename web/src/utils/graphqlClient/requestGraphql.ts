import toast from "solid-toast"
import { loginToken } from "../auth"

export class GraphQLError extends Error {
  constructor(private errorsResponse: any) {
    super(`GraphQL error: ${JSON.stringify(errorsResponse)}`)
  }

  get isUnauthenticatedError() {
    return this.code === "UNAUTHENTICATED"
  }

  get code() {
    return this.errorsResponse?.[0]?.extensions?.code
  }
}

export interface FileInfo {
  file: File
  path: string
}

export const requestGraphql = async <Result>(
  query: string,
  serializedVariables: string,
  files?: FileInfo[]
): Promise<Result> => {
  const token = loginToken()

  let body: string | FormData
  let headers: Record<string, string>

  if (files && files.length > 0) {
    // Use multipart/form-data for file uploads
    const formData = new FormData()

    const operations = {
      query,
      variables: JSON.parse(serializedVariables)
    }

    formData.append("operations", JSON.stringify(operations))

    // Create a map of file positions
    const map: Record<string, string[]> = {}
    files.forEach((fileInfo, index) => {
      map[index] = [fileInfo.path]
      formData.append(index.toString(), fileInfo.file)
    })

    formData.append("map", JSON.stringify(map))

    body = formData
    headers = {
      Authorization: token ? `Bearer ${token}` : ""
    }
  } else {
    // Use JSON for regular requests
    body = `{"query":${JSON.stringify(query)},"variables":${serializedVariables}}`
    headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    }
  }

  const response = await fetchWithRetry(() =>
    fetch("/graphql", {
      method: "POST",
      body,
      headers
    })
  )

  const { data, errors } = (await response.json()) as any

  if (errors) {
    throw new GraphQLError(errors)
  }

  return data
}

const maxRetries = 2

const fetchWithRetry = async (fetch: () => Promise<Response>, retries = 0): Promise<Response> => {
  const response = await fetch()

  if (response.status < 500) {
    return response
  }

  if (retries === 0) {
    toast("Having some connection problems, retrying ... this may take a minute.")
  }

  if (retries < maxRetries) {
    return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
      fetchWithRetry(fetch, retries + 1)
    )
  }

  throw new Error("Still getting 50x errors after max retries exceeded. Please try again later.")
}
