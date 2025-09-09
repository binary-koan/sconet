import { DeleteCredentialMutation, DeleteCredentialMutationVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery.ts"

const MUTATION = gql`
  mutation DeleteCredential($id: ID!) {
    credentialDelete(input: { id: $id }) {
      currentUser {
        id
      }
    }
  }
`

export const useDeleteCredential = (options: MutationOptions<DeleteCredentialMutation> = {}) =>
  useMutation<DeleteCredentialMutation, DeleteCredentialMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
