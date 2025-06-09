import { AccountsQuery, AccountsQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { FullAccountFragment } from "../fragments/accountFragments.ts"

export const ACCOUNTS_QUERY = gql`
  ${FullAccountFragment}

  query Accounts($archived: Boolean!) {
    accounts(archived: $archived) {
      ...FullAccount
    }
  }
`

export const useAccountsQuery = () =>
  useQuery<AccountsQuery, AccountsQueryVariables>(ACCOUNTS_QUERY)
