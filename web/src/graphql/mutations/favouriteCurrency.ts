import { FavouriteCurrencyMutation, FavouriteCurrencyMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

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
