import { DeleteAccountMutation, DeleteAccountMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"

const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount($id: ID!) {
    accountDelete(input: { id: $id }) {
      account {
        id
      }
    }
  }
`

export const useDeleteAccount = (options: MutationOptions<DeleteAccountMutation> = {}) =>
  useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DELETE_ACCOUNT_MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY],
    ...options
  })
