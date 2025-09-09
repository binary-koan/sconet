import {
  RegisterCredentialMutation,
  RegisterCredentialMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"

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
