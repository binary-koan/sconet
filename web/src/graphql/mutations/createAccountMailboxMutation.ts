import {
  CreateAccountMailboxMutation,
  CreateAccountMailboxMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNT_MAILBOXES_QUERY } from "../queries/accountMailboxesQuery"

const CREATE_ACCOUNT_MAILBOX_MUTATION = gql`
  mutation CreateAccountMailbox($input: CreateAccountMailboxInput!) {
    createAccountMailbox(input: $input) {
      id
    }
  }
`

export const useCreateAccountMailbox = (
  options: MutationOptions<CreateAccountMailboxMutation> = {}
) =>
  useMutation<CreateAccountMailboxMutation, CreateAccountMailboxMutationVariables>(
    CREATE_ACCOUNT_MAILBOX_MUTATION,
    {
      refetchQueries: [ACCOUNT_MAILBOXES_QUERY],
      ...options
    }
  )
