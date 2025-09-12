import {
  UnfavouriteCurrencyMutation,
  UnfavouriteCurrencyMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation UnfavouriteCurrency($id: ID!) {
    favouriteCurrencyToggle(input: { id: $id, favourite: false }) {
      currentUser {
        id
      }
    }
  }
`

export const useUnfavouriteCurrency = (
  options: MutationOptions<UnfavouriteCurrencyMutation> = {}
) =>
  useMutation<UnfavouriteCurrencyMutation, UnfavouriteCurrencyMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
