import {
  UnfavouriteCurrencyMutation,
  UnfavouriteCurrencyMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery.ts"

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
