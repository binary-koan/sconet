import { loginToken } from "../auth"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4444" : ""

export const requestGraphql = async <Result>(
  query: string,
  serializedVariables: string
): Promise<Result> => {
  const token = loginToken()

  const response = await fetch(`${BASE_URL}/graphql`, {
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
