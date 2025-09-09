import { GetAccountQuery, GetAccountQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullAccountFragment } from "../fragments/accountFragments.ts"

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
