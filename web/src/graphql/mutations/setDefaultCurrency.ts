import {
  SetDefaultCurrencyMutation,
  SetDefaultCurrencyMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation SetDefaultCurrency($code: CurrencyCode!) {
    setDefaultCurrency(code: $code) {
      id
    }
  }
`

export const useSetDefaultCurrency = (options: MutationOptions<SetDefaultCurrencyMutation> = {}) =>
  useMutation<SetDefaultCurrencyMutation, SetDefaultCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
