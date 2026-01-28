import { gql } from "@apollo/client/core"
import { useMutation } from "@apollo/client/react"

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  login: {
    user: {
      token: string
      email: string
    }
  }
}

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        token
        email
      }
    }
  }
`

export function useLoginMutation() {
  return useMutation<LoginResult, LoginInput>(LOGIN_MUTATION)
}
