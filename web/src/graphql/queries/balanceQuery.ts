import { BalanceQuery, BalanceQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"

export const BALANCE_QUERY = gql`
  query Balance($currencyId: ID, $year: Int!) {
    balance(year: $year, currencyId: $currencyId) {
      currency {
        symbol
      }
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
      months {
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
      }
    }
  }
`

export const useBalanceQuery = (variables: () => BalanceQueryVariables) =>
  useQuery<BalanceQuery, BalanceQueryVariables>(BALANCE_QUERY, variables)
