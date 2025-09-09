import { CurrenciesQuery, CurrenciesQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullCurrencyFragment } from "../fragments/currencyFragments.ts"

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
