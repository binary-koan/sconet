import {
  FavouriteTransactionUpsertMutation,
  FavouriteTransactionUpsertMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"

const MUTATION = gql`
  mutation FavouriteTransactionUpsert(
    $name: String!
    $shop: String!
    $memo: String
    $priceCents: Int
    $accountId: ID
  ) {
    favouriteTransactionUpsert(
      input: {
        name: $name
        shop: $shop
        memo: $memo
        priceCents: $priceCents
        accountId: $accountId
      }
    ) {
      favouriteTransaction {
        id
        name
      }
    }
  }
`

export const useFavouriteTransactionUpsert = (
  options: MutationOptions<FavouriteTransactionUpsertMutation> = {}
) =>
  useMutation<FavouriteTransactionUpsertMutation, FavouriteTransactionUpsertMutationVariables>(
    MUTATION,
    options
  )
