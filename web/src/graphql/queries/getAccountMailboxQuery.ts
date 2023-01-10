import { GetAccountMailboxQuery, GetAccountMailboxQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { FullAccountMailboxFragment } from "../fragments/accountMailboxFragments"

export const GET_ACCOUNT_MAILBOX_QUERY = gql`
  ${FullAccountMailboxFragment}

  query GetAccountMailbox($id: String!) {
    accountMailbox(id: $id) {
      ...FullAccountMailbox
    }
  }
`

export const useGetAccountMailboxQuery = (variables: () => GetAccountMailboxQueryVariables) =>
  useQuery<GetAccountMailboxQuery, GetAccountMailboxQueryVariables>(
    GET_ACCOUNT_MAILBOX_QUERY,
    variables
  )
