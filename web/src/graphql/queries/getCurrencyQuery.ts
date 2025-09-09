import { GetCurrencyQuery, GetCurrencyQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullCurrencyFragment } from "../fragments/currencyFragments.ts"

export const CURRENCY_QUERY = gql`
  ${FullCurrencyFragment}

  query GetCurrency($id: ID!) {
    currency(id: $id) {
      ...FullCurrency
    }
  }
`

export const useGetCurrencyQuery = (variables: () => GetCurrencyQueryVariables) =>
  useQuery<GetCurrencyQuery, GetCurrencyQueryVariables>(CURRENCY_QUERY, variables)
