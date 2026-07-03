import { UnconfirmedTransactionsQuery, UnconfirmedTransactionsQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { FullTransactionFragment } from "../fragments/transactionFragments"

export const UNCONFIRMED_TRANSACTIONS_QUERY = gql`
  ${FullTransactionFragment}

  query UnconfirmedTransactions {
    transactions(first: 100, filter: { confirmed: false }) {
      nodes {
        ...FullTransaction
      }
    }
  }
`

export const useUnconfirmedTransactionsQuery = () =>
  useQuery<UnconfirmedTransactionsQuery, UnconfirmedTransactionsQueryVariables>(
    UNCONFIRMED_TRANSACTIONS_QUERY
  )
