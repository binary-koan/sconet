import toast from "solid-toast"
import { loginToken } from "../auth"

export class GraphQLError extends Error {
  constructor(private errorsResponse: any) {
    super(`GraphQL error: ${JSON.stringify(errorsResponse)}`)
  }

  get isUnauthenticatedError() {
    return this.errorsResponse?.[0]?.extensions?.code === "UNAUTHENTICATED"
  }
}

export const requestGraphql = async <Result>(
  query: string,
  serializedVariables: string
): Promise<Result> => {
  const token = loginToken()

  const response = await fetchWithRetry(() =>
    fetch("/graphql", {
      method: "POST",
      body: `{"query":${JSON.stringify(query)},"variables":${serializedVariables}}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      }
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
