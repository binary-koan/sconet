import { AccountMailboxesQuery, AccountMailboxesQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
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
