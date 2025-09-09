import { TransactionsQuery, TransactionsQueryVariables } from "../../graphql-types.ts"
import { gql } from "../../utils/gql.ts"
import { useQuery } from "../../utils/graphqlClient/useQuery.ts"
import { ListingTransactionFragment } from "../fragments/transactionFragments.ts"

export const TRANSACTIONS_QUERY = gql`
  ${ListingTransactionFragment}

  query Transactions($limit: Int, $offset: String, $filter: TransactionFilterInput) {
    transactions(first: $limit, after: $offset, filter: $filter) {
      nodes {
        ...ListingTransaction
      }
      pageInfo {
        endCursor
      }
    }
  }
`

export const useTransactionsQuery = (variables: () => TransactionsQueryVariables) =>
  useQuery<TransactionsQuery, TransactionsQueryVariables>(TRANSACTIONS_QUERY, variables)
