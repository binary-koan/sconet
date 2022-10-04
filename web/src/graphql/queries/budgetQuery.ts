import { gql } from "@solid-primitives/graphql"
import { BudgetsQuery, BudgetsQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"

export const BUDGET_QUERY = gql`
  query Budgets($year: Int!, $month: Int!) {
    budget(year: $year, month: $month, currency: "JPY") {
      id
      month
      income {
        decimalAmount
        formatted
      }
      totalSpending {
        decimalAmount
        formatted
      }
      difference {
        decimalAmount
        formatted
      }
      regularCategories {
        totalSpending {
          decimalAmount
          formatted
        }
        categories {
          id
          category {
            id
            name
            color
            icon
            isRegular
            budget(currency: "JPY") {
              decimalAmount
              formatted
            }
          }
          amountSpent {
            decimalAmount
            formatted
          }
        }
      }
      irregularCategories {
        totalSpending {
          decimalAmount
          formatted
        }
        categories {
          id
          category {
            id
            name
            color
            icon
            isRegular
            budget {
              decimalAmount
              formatted
            }
          }
          amountSpent {
            decimalAmount
            formatted
          }
        }
      }
    }
  }
`

export const useBudgetQuery = (variables: () => BudgetsQueryVariables) =>
  useQuery<BudgetsQuery, BudgetsQueryVariables>(BUDGET_QUERY, variables)
