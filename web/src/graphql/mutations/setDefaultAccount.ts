import {
  SetDefaultAccountMutation,
  SetDefaultAccountMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery.ts"

const MUTATION = gql`
  mutation SetDefaultAccount($id: ID!) {
    currentUserUpdate(input: { userInput: { defaultAccountId: $id } }) {
      currentUser {
        id
      }
    }
  }
`

export const useSetDefaultAccount = (options: MutationOptions<SetDefaultAccountMutation> = {}) =>
  useMutation<SetDefaultAccountMutation, SetDefaultAccountMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
