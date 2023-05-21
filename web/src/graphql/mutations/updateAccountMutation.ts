import { UpdateAccountMutation, UpdateAccountMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { FullAccountFragment } from "../fragments/accountFragments"
import { ACCOUNTS_QUERY } from "../queries/accountsQuery"
import { GET_ACCOUNT_QUERY } from "../queries/getAccountQuery"

const UPDATE_ACCOUNT_MUTATION = gql`
  ${FullAccountFragment}

  mutation UpdateAccount($id: String!, $input: UpdateAccountInput!) {
    updateAccount(id: $id, input: $input) {
      ...FullAccount
    }
  }
`

export const useUpdateAccount = (options: MutationOptions<UpdateAccountMutation> = {}) =>
  useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UPDATE_ACCOUNT_MUTATION, {
    refetchQueries: [ACCOUNTS_QUERY, GET_ACCOUNT_QUERY],
    ...options
  })
