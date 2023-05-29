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

  const response = await fetch("/graphql", {
    method: "POST",
    body: `{"query":${JSON.stringify(query)},"variables":${serializedVariables}}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    }
  })

  const { data, errors } = (await response.json()) as any

  if (errors) {
    throw new GraphQLError(errors)
  }

  return data
}
