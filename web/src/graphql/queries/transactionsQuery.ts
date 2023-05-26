import { TransactionsQuery, TransactionsQueryVariables } from "../../graphql-types"
import { gql } from "../../utils/gql"
import { useQuery } from "../../utils/graphqlClient/useQuery"
import { ListingTransactionFragment } from "../fragments/transactionFragments"

export const TRANSACTIONS_QUERY = gql`
  ${ListingTransactionFragment}

  query Transactions($limit: Int, $offset: String, $filter: TransactionFilter) {
    transactions(limit: $limit, offset: $offset, filter: $filter) {
      data {
        ...ListingTransaction
      }
      nextOffset
    }
  }
`

export const useTransactionsQuery = (variables: () => TransactionsQueryVariables) =>
  useQuery<TransactionsQuery, TransactionsQueryVariables>(TRANSACTIONS_QUERY, variables)
