import { BudgetQuery, BudgetQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const BUDGET_QUERY = gql`
  query Budget($currencyCode: String, $year: Int!, $month: Int!) {
    budget(year: $year, month: $month, currencyCode: $currencyCode) {
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
            budget(currencyCode: $currencyCode) {
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

export const useBudgetQuery = (variables: () => BudgetQueryVariables) =>
  useQuery<BudgetQuery, BudgetQueryVariables>(BUDGET_QUERY, variables)
