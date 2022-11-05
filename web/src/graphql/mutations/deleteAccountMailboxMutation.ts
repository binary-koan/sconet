import { DeleteAccountMailboxMutation } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { ACCOUNT_MAILBOXES_QUERY } from "../queries/accountMailboxesQuery"

const DELETE_ACCOUNT_MAILBOX_MUTATION = gql`
  mutation DeleteAccountMailbox($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`

export const useDeleteAccountMailbox = (options: MutationOptions<DeleteAccountMailboxMutation>) =>
  useMutation(DELETE_ACCOUNT_MAILBOX_MUTATION, {
    refetchQueries: [ACCOUNT_MAILBOXES_QUERY],
    ...options
  })
