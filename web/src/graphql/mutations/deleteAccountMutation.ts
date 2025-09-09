import { DeleteAccountMutation, DeleteAccountMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery.ts"

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
