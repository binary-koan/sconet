import {
  GenerateCredentialLoginOptionsMutation,
  GenerateCredentialLoginOptionsMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"

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
