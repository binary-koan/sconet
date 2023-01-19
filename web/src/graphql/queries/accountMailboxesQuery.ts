import { AccountMailboxesQuery, AccountMailboxesQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullAccountMailboxFragment } from "../fragments/accountMailboxFragments"

export const ACCOUNT_MAILBOXES_QUERY = gql`
  ${FullAccountMailboxFragment}

  query AccountMailboxes {
    accountMailboxes {
      ...FullAccountMailbox
    }
  }
`

export const useAccountMailboxesQuery = () =>
  useQuery<AccountMailboxesQuery, AccountMailboxesQueryVariables>(ACCOUNT_MAILBOXES_QUERY)
