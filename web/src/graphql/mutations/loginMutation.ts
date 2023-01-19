import { LoginMutation, LoginMutationVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { MutationOptions, useMutation } from "../../utils/graphqlClient/useMutation"

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $turnstileToken: String!) {
    login(email: $email, password: $password, turnstileToken: $turnstileToken)
  }
`

export const useLoginMutation = (options: MutationOptions<LoginMutation> = {}) =>
  useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
    refetchQueries: "ALL",
    ...options
  })
