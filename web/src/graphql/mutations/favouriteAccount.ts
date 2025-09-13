import { FavouriteAccountMutation, FavouriteAccountMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"
import { GET_ACCOUNT_QUERY } from "../queries/getAccountQuery"

const MUTATION = gql`
  mutation FavouriteAccount($id: ID!) {
    accountUpdate(input: { id: $id, accountInput: { favourite: true } }) {
      account {
        id
      }
    }
  }
`

export const useFavouriteAccount = (options: MutationOptions<FavouriteAccountMutation> = {}) =>
  useMutation<FavouriteAccountMutation, FavouriteAccountMutationVariables>(MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY, GET_ACCOUNT_QUERY],
    ...options
  })
