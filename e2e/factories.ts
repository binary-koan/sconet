import { CreateAccountInput, CreateCategoryInput } from "../web/src/graphql-types"
import { apiContext } from "./fixtures"

export async function createAccount(input: CreateAccountInput) {
  return await makeGraphQLRequest(
    `mutation AccountFactory($input: CreateAccountInput!) {
      createAccount(input: $input) {
        id
      }
    }`,
    { input }
  )
}

export async function createCategory(input: CreateCategoryInput) {
  return await makeGraphQLRequest(
    `mutation CategoryFactory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        id
      }
    }`,
    { input }
  )
}

async function makeGraphQLRequest(query: string, variables: any) {
  const response = await apiContext().post("/graphql", {
    data: { query, variables }
  })

  const data = await response.json()

  if ("errors" in data) {
    throw new Error("GraphQL Error: " + JSON.stringify(data.errors))
  }

  return data["data"]
}
