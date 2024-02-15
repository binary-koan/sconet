import { GetAccountQuery, GetAccountQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullAccountFragment } from "../fragments/accountFragments"

export const GET_ACCOUNT_QUERY = gql`
  ${FullAccountFragment}

  query GetAccount($id: ID!) {
    account(id: $id) {
      ...FullAccount
    }
  }
`

export const useGetAccountQuery = (variables: () => GetAccountQueryVariables) =>
  useQuery<GetAccountQuery, GetAccountQueryVariables>(GET_ACCOUNT_QUERY, variables)
