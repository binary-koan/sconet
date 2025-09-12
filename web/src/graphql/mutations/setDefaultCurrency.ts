import {
  SetDefaultCurrencyMutation,
  SetDefaultCurrencyMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation SetDefaultCurrency($id: ID!) {
    currentUserUpdate(input: { userInput: { defaultCurrencyId: $id } }) {
      currentUser {
        id
      }
    }
  }
`

export const useSetDefaultCurrency = (options: MutationOptions<SetDefaultCurrencyMutation> = {}) =>
  useMutation<SetDefaultCurrencyMutation, SetDefaultCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
