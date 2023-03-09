import { DeleteCredentialMutation, DeleteCredentialMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation DeleteCredential($id: String!) {
    deleteCredential(id: $id) {
      id
    }
  }
`

export const useDeleteCredential = (options: MutationOptions<DeleteCredentialMutation> = {}) =>
  useMutation<DeleteCredentialMutation, DeleteCredentialMutationVariables>(MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })
