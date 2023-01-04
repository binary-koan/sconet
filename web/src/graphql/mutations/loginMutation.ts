import { LoginMutation, LoginMutationVariables } from "../../graphql-types"
import { MutationOptions, useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

export const useLoginMutation = (options: MutationOptions<LoginMutation>) =>
  useMutation<LoginMutation, LoginMutationVariables>(
    LOGIN_MUTATION,
    {
      refetchQueries: 'ALL',
      ...options
    }
  )
