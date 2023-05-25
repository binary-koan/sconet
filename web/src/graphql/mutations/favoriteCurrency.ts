import { FavoriteCurrencyMutation, FavoriteCurrencyMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation FavoriteCurrency($code: CurrencyCode!) {
    favoriteCurrency(code: $code) {
      id
    }
  }
`

export const useFavoriteCurrency = (options: MutationOptions<FavoriteCurrencyMutation> = {}) =>
  useMutation<FavoriteCurrencyMutation, FavoriteCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
