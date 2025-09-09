import { CreateAccountMutation, CreateAccountMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery.ts"

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
