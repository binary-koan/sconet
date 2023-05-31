import type {
  CreateAccountInput,
  CreateCategoryInput,
  CreateTransactionInput
} from "../web/src/graphql-types"
import { apiContext } from "./fixtures"

export async function createAccount(input: CreateAccountInput) {
  return (
    await makeGraphQLRequest(
      `mutation AccountFactory($input: CreateAccountInput!) {
        createAccount(input: $input) {
          id
        }
      }`,
      { input }
    )
  ).createAccount
}

export async function createCategory(input: CreateCategoryInput) {
  return (
    await makeGraphQLRequest(
      `mutation CategoryFactory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
          id
        }
      }`,
      { input }
    )
  ).createCategory
}

export async function createTransaction(input: CreateTransactionInput) {
  return (
    await makeGraphQLRequest(
      `mutation TransactionFactory($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          id
        }
      }`,
      { input }
    )
  ).createTransaction
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
