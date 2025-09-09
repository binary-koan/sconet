import {
  LoginViaCredentialMutation,
  LoginViaCredentialMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"

const MUTATION = gql`
  mutation LoginViaCredential($email: String!, $response: JSON!) {
    login(input: { email: $email, webauthnResponse: $response }) {
      user {
        token
        email
      }
    }
  }
`

export const useLoginViaCredentialMutation = (
  options: MutationOptions<LoginViaCredentialMutation> = {}
) =>
  useMutation<LoginViaCredentialMutation, LoginViaCredentialMutationVariables>(MUTATION, {
    refetchQueries: "ALL",
    ...options
  })
