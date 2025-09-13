import {
  UnfavouriteAccountMutation,
  UnfavouriteAccountMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"
import { GET_ACCOUNT_QUERY } from "../queries/getAccountQuery"

const MUTATION = gql`
  mutation UnfavouriteAccount($id: ID!) {
    accountUpdate(input: { id: $id, accountInput: { favourite: false } }) {
      account {
        id
      }
    }
  }
`

export const useUnfavouriteAccount = (options: MutationOptions<UnfavouriteAccountMutation> = {}) =>
  useMutation<UnfavouriteAccountMutation, UnfavouriteAccountMutationVariables>(MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY, GET_ACCOUNT_QUERY],
    ...options
  })
