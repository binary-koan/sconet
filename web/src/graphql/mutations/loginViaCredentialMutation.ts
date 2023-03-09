import {
  LoginViaCredentialMutation,
  LoginViaCredentialMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"

const MUTATION = gql`
  mutation LoginViaCredential($response: JSON!) {
    loginViaCredential(response: $response)
  }
`

export const useLoginViaCredentialMutation = (
  options: MutationOptions<LoginViaCredentialMutation> = {}
) =>
  useMutation<LoginViaCredentialMutation, LoginViaCredentialMutationVariables>(MUTATION, {
    refetchQueries: "ALL",
    ...options
  })
