import {
  CreateAccountMailboxMutation,
  CreateAccountMailboxMutationVariables
} from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { ACCOUNT_MAILBOXES_QUERY } from "../queries/accountMailboxesQuery"

const CREATE_ACCOUNT_MAILBOX_MUTATION = gql`
  mutation CreateAccountMailbox($input: CreateAccountMailboxInput!) {
    createAccountMailbox(input: $input) {
      id
    }
  }
`

export const useCreateAccountMailbox = (options: MutationOptions<CreateAccountMailboxMutation>) =>
  useMutation<CreateAccountMailboxMutation, CreateAccountMailboxMutationVariables>(
    CREATE_ACCOUNT_MAILBOX_MUTATION,
    {
      refetchQueries: [ACCOUNT_MAILBOXES_QUERY],
      ...options
    }
  )
