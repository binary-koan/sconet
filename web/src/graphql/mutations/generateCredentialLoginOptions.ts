import {
  GenerateCredentialLoginOptionsMutation,
  GenerateCredentialLoginOptionsMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"

const MUTATION = gql`
  mutation GenerateCredentialLoginOptions($email: String!) {
    credentialLoginStart(input: { email: $email }) {
      options
    }
  }
`

export const useGenerateCredentialLoginOptionsMutation = (
  options: MutationOptions<GenerateCredentialLoginOptionsMutation> = {}
) =>
  useMutation<
    GenerateCredentialLoginOptionsMutation,
    GenerateCredentialLoginOptionsMutationVariables
  >(MUTATION, {
    refetchQueries: "ALL",
    ...options
  })
