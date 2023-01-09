import { GetCurrencyQuery, GetCurrencyQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullCurrencyFragment } from "../fragments/currencyFragments"

export const CURRENCY_QUERY = gql`
  ${FullCurrencyFragment}

  query GetCurrency($id: String!) {
    currency(id: $id) {
      ...FullCurrency
    }
  }
`

export const useGetCurrencyQuery = (variables: () => GetCurrencyQueryVariables) =>
  useQuery<GetCurrencyQuery, GetCurrencyQueryVariables>(CURRENCY_QUERY, variables)
