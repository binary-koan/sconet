import {
  SetDefaultCurrencyMutation,
  SetDefaultCurrencyMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery.ts"

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
