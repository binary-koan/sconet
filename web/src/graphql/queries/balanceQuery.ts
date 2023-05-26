import { BalanceQuery, BalanceQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const BALANCE_QUERY = gql`
  query Balance($currencyCode: CurrencyCode, $year: Int!) {
    balance(year: $year, currencyCode: $currencyCode) {
      currency {
        symbol
      }
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
      months {
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
      }
    }
  }
`

export const useBalanceQuery = (variables: () => BalanceQueryVariables) =>
  useQuery<BalanceQuery, BalanceQueryVariables>(BALANCE_QUERY, variables)
