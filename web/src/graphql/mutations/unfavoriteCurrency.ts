import {
  UnfavoriteCurrencyMutation,
  UnfavoriteCurrencyMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation UnfavoriteCurrency($code: CurrencyCode!) {
    unfavoriteCurrency(code: $code) {
      id
    }
  }
`

export const useUnfavoriteCurrency = (options: MutationOptions<UnfavoriteCurrencyMutation> = {}) =>
  useMutation<UnfavoriteCurrencyMutation, UnfavoriteCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
