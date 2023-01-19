import {
  UpdateAccountMailboxMutation,
  UpdateAccountMailboxMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { FullAccountMailboxFragment } from "../fragments/accountMailboxFragments"
import { ACCOUNT_MAILBOXES_QUERY } from "../queries/accountMailboxesQuery"
import { GET_ACCOUNT_MAILBOX_QUERY } from "../queries/getAccountMailboxQuery"

const UPDATE_ACCOUNT_MAILBOX_MUTATION = gql`
  ${FullAccountMailboxFragment}

  mutation UpdateAccountMailbox($id: String!, $input: UpdateAccountMailboxInput!) {
    updateAccountMailbox(id: $id, input: $input) {
      ...FullAccountMailbox
    }
  }
`

export const useUpdateAccountMailbox = (
  options: MutationOptions<UpdateAccountMailboxMutation> = {}
) =>
  useMutation<UpdateAccountMailboxMutation, UpdateAccountMailboxMutationVariables>(
    UPDATE_ACCOUNT_MAILBOX_MUTATION,
    {
      refetchQueries: [ACCOUNT_MAILBOXES_QUERY, GET_ACCOUNT_MAILBOX_QUERY],
      ...options
    }
  )
