import { SetDefaultAccountMutation, SetDefaultAccountMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

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
