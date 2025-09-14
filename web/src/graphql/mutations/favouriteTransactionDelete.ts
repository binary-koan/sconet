import {
  FavouriteTransactionDeleteMutation,
  FavouriteTransactionDeleteMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { FAVOURITE_TRANSACTIONS_QUERY } from "../queries/favouriteTransactionsQuery"

const MUTATION = gql`
  mutation FavouriteTransactionDelete($id: ID!) {
    favouriteTransactionDelete(input: { id: $id }) {
      favouriteTransaction {
        id
      }
    }
  }
`

export const useFavouriteTransactionDelete = (
  options: MutationOptions<FavouriteTransactionDeleteMutation> = {}
) =>
  useMutation<FavouriteTransactionDeleteMutation, FavouriteTransactionDeleteMutationVariables>(
    MUTATION,
    {
      refetchQueries: [FAVOURITE_TRANSACTIONS_QUERY],
      ...options
    }
  )
