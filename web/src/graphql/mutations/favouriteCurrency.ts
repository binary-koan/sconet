import {
  FavouriteCurrencyMutation,
  FavouriteCurrencyMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery.ts"

const MUTATION = gql`
  mutation FavouriteCurrency($id: ID!) {
    favouriteCurrencyToggle(input: { id: $id, favourite: true }) {
      currentUser {
        id
      }
    }
  }
`

export const useFavouriteCurrency = (options: MutationOptions<FavouriteCurrencyMutation> = {}) =>
  useMutation<FavouriteCurrencyMutation, FavouriteCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
