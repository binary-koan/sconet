import { CurrentExchangeRatesQuery, CurrentExchangeRatesQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const CURRENT_EXCHANGE_RATES_QUERY = gql`
  query CurrentExchangeRates {
    currentExchangeRates {
      date
      fromCurrency {
        code
      }
      rates {
        toCurrency {
          code
        }
        rate
      }
    }
  }
`

export const useCurrentExchangeRatesQuery = () =>
  useQuery<CurrentExchangeRatesQuery, CurrentExchangeRatesQueryVariables>(
    CURRENT_EXCHANGE_RATES_QUERY
  )
