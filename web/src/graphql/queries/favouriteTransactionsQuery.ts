import {
  FavouriteTransactionsQuery,
  FavouriteTransactionsQueryVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"

export const FAVOURITE_TRANSACTIONS_QUERY = gql`
  query FavouriteTransactions {
    favouriteTransactions {
      id
      name
      shop
      memo
      priceCents
      account {
        id
        name
        currency {
          id
        }
      }
    }
  }
`

export const useFavouriteTransactionsQuery = () =>
  useQuery<FavouriteTransactionsQuery, FavouriteTransactionsQueryVariables>(
    FAVOURITE_TRANSACTIONS_QUERY,
    () => ({})
  )
