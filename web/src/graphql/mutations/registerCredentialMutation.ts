import {
  RegisterCredentialMutation,
  RegisterCredentialMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"

const MUTATION = gql`
  mutation RegisterCredential {
    registerCredential
  }
`

export const useRegisterCredential = (options: MutationOptions<RegisterCredentialMutation> = {}) =>
  useMutation<RegisterCredentialMutation, RegisterCredentialMutationVariables>(MUTATION, {
    ...options
  })
