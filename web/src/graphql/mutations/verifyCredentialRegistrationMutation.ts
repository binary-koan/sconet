import {
  VerifyCredentialRegistrationMutation,
  VerifyCredentialRegistrationMutationVariables
} from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation.ts"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery.ts"

const MUTATION = gql`
  mutation VerifyCredentialRegistration($response: JSON!, $device: String!) {
    credentialRegister(input: { response: $response, device: $device }) {
      currentUser {
        id
      }
    }
  }
`

export const useVerifyCredentialRegistration = (
  options: MutationOptions<VerifyCredentialRegistrationMutation> = {}
) =>
  useMutation<VerifyCredentialRegistrationMutation, VerifyCredentialRegistrationMutationVariables>(
    MUTATION,
    { refetchQueries: [CURRENT_USER_QUERY], ...options }
  )
