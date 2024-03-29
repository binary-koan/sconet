import { AccountsQuery, AccountsQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullAccountFragment } from "../fragments/accountFragments"

export const ACCOUNTS_QUERY = gql`
  ${FullAccountFragment}

  query Accounts {
    accounts {
      ...FullAccount
    }
  }
`

export const useAccountsQuery = () =>
  useQuery<AccountsQuery, AccountsQueryVariables>(ACCOUNTS_QUERY)
