import { UpdateAccountMutation, UpdateAccountMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { FullAccountFragment } from "../fragments/accountFragments.ts"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery.ts"
import { GET_ACCOUNT_QUERY } from "../queries/getAccountQuery.ts"

const UPDATE_ACCOUNT_MUTATION = gql`
  ${FullAccountFragment}

  mutation UpdateAccount($id: ID!, $input: AccountInput!) {
    accountUpdate(input: { id: $id, accountInput: $input }) {
      account {
        id
      }
    }
  }
`

export const useUpdateAccount = (options: MutationOptions<UpdateAccountMutation> = {}) =>
  useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UPDATE_ACCOUNT_MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY, GET_ACCOUNT_QUERY],
    ...options
  })
