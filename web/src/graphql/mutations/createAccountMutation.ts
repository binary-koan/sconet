import { CreateAccountMutation, CreateAccountMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: AccountInput!) {
    accountCreate(input: { accountInput: $input }) {
      account {
        id
      }
    }
  }
`

export const useCreateAccount = (options: MutationOptions<CreateAccountMutation> = {}) =>
  useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY],
    ...options
  })
