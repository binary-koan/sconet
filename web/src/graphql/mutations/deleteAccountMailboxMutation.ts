import {
  DeleteAccountMailboxMutation,
  DeleteAccountMailboxMutationVariables
} from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { ACCOUNT_MAILBOXES_QUERY } from "../queries/accountMailboxesQuery"

const DELETE_ACCOUNT_MAILBOX_MUTATION = gql`
  mutation DeleteAccountMailbox($id: String!) {
    deleteAccountMailbox(id: $id) {
      id
    }
  }
`

export const useDeleteAccountMailbox = (options: MutationOptions<DeleteAccountMailboxMutation>) =>
  useMutation<DeleteAccountMailboxMutation, DeleteAccountMailboxMutationVariables>(
    DELETE_ACCOUNT_MAILBOX_MUTATION,
    {
      refetchQueries: [ACCOUNT_MAILBOXES_QUERY],
      ...options
    }
  )
