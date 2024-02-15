import { BudgetQuery, BudgetQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const BUDGET_QUERY = gql`
  query Budget(
    $currencyId: ID
    $year: Int!
    $month: Int!
    $monthStart: ISO8601Date!
    $monthEnd: ISO8601Date!
  ) {
    budget(year: $year, month: $month, currencyId: $currencyId) {
      id
      month
      income {
        amountDecimal
        formatted
      }
      totalSpending {
        amountDecimal
        formatted
      }
      difference {
        amountDecimal
        formatted
      }
      regularCategories {
        totalSpending {
          amountDecimal
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
            budget(date: $monthStart) {
              budget(currencyId: $currencyId) {
                amountDecimal
                formatted
              }
            }
          }
          amountSpent {
            amountDecimal
            formatted
          }
        }
      }
      irregularCategories {
        totalSpending {
          amountDecimal
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
            budget(date: $monthStart) {
              budget(currencyId: $currencyId) {
                amountDecimal
                formatted
              }
            }
          }
          amountSpent {
            amountDecimal
            formatted
          }
        }
      }
    }

    income: transactions(
      filter: { dateFrom: $monthStart, dateUntil: $monthEnd, minAmountCents: 1 }
    ) {
      nodes {
        id
        memo
        amount(currencyId: $currencyId) {
          formatted
          amountDecimal
        }
      }
    }
  }
`

export const useBudgetQuery = (variables: () => BudgetQueryVariables) =>
  useQuery<BudgetQuery, BudgetQueryVariables>(BUDGET_QUERY, variables)
