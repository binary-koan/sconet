import { BudgetQuery, BudgetQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"

export const BUDGET_QUERY = gql`
  query Budget($currencyId: String, $year: Int!, $month: Int!) {
    budget(year: $year, month: $month, currencyId: $currencyId) {
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
            budget(currencyId: $currencyId) {
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
