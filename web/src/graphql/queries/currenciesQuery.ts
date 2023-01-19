import { CurrenciesQuery, CurrenciesQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullCurrencyFragment } from "../fragments/currencyFragments"

export const CURRENCIES_QUERY = gql`
  ${FullCurrencyFragment}

  query Currencies {
    currencies {
      ...FullCurrency
    }
  }
`

export const useCurrenciesQuery = () =>
  useQuery<CurrenciesQuery, CurrenciesQueryVariables>(CURRENCIES_QUERY)
