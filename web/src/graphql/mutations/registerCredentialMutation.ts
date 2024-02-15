import {
  RegisterCredentialMutation,
  RegisterCredentialMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"

const MUTATION = gql`
  mutation RegisterCredential {
    credentialRegistrationStart(input: {}) {
      options
    }
  }
`

export const useRegisterCredential = (options: MutationOptions<RegisterCredentialMutation> = {}) =>
  useMutation<RegisterCredentialMutation, RegisterCredentialMutationVariables>(MUTATION, {
    ...options
  })
