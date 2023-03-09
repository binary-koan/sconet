import {
  VerifyCredentialRegistrationMutation,
  VerifyCredentialRegistrationMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const MUTATION = gql`
  mutation VerifyCredentialRegistration($response: JSON!, $device: String!) {
    verifyCredentialRegistration(response: $response, device: $device)
  }
`

export const useVerifyCredentialRegistration = (
  options: MutationOptions<VerifyCredentialRegistrationMutation> = {}
) =>
  useMutation<VerifyCredentialRegistrationMutation, VerifyCredentialRegistrationMutationVariables>(
    MUTATION,
    { refetchQueries: [CURRENT_USER_QUERY], ...options }
  )
