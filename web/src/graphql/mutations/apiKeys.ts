import {
  CreateApiKeyMutation,
  CreateApiKeyMutationVariables,
  RegenerateApiKeyMutation,
  RegenerateApiKeyMutationVariables,
  SetApiKeyDisabledMutation,
  SetApiKeyDisabledMutationVariables
} from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"
import { CURRENT_USER_QUERY } from "../queries/currentUserQuery"

const CREATE_MUTATION = gql`
  mutation CreateApiKey($name: String!) {
    apiKeyCreate(input: { name: $name }) {
      apiKey {
        id
        token
      }
    }
  }
`

export const useCreateApiKey = (options: MutationOptions<CreateApiKeyMutation> = {}) =>
  useMutation<CreateApiKeyMutation, CreateApiKeyMutationVariables>(CREATE_MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })

const REGENERATE_MUTATION = gql`
  mutation RegenerateApiKey($id: ID!) {
    apiKeyRegenerate(input: { id: $id }) {
      apiKey {
        id
        token
      }
    }
  }
`

export const useRegenerateApiKey = (options: MutationOptions<RegenerateApiKeyMutation> = {}) =>
  useMutation<RegenerateApiKeyMutation, RegenerateApiKeyMutationVariables>(REGENERATE_MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    ...options
  })

const SET_DISABLED_MUTATION = gql`
  mutation SetApiKeyDisabled($id: ID!, $disabled: Boolean!) {
    apiKeySetDisabled(input: { id: $id, disabled: $disabled }) {
      apiKey {
        id
        disabledAt
      }
    }
  }
`

export const useSetApiKeyDisabled = (options: MutationOptions<SetApiKeyDisabledMutation> = {}) =>
  useMutation<SetApiKeyDisabledMutation, SetApiKeyDisabledMutationVariables>(
    SET_DISABLED_MUTATION,
    {
      refetchQueries: [CURRENT_USER_QUERY],
      ...options
    }
  )
