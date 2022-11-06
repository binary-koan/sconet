import { TransactionsQuery, TransactionsQueryVariables } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"

export const TRANSACTIONS_QUERY = gql`
  query Transactions($limit: Int, $offset: String, $filter: TransactionFilter) {
    transactions(limit: $limit, offset: $offset, filter: $filter) {
      data {
        id
        memo
        date
        originalMemo
        amount {
          decimalAmount
          formatted
        }
        includeInReports
        category {
          id
          name
          color
          icon
        }
        accountMailbox {
          id
          name
        }
        splitTo {
          id
          memo
          amount {
            decimalAmount
            formatted
          }
          category {
            id
            name
            icon
            color
          }
          includeInReports
        }
      }
      nextOffset
    }
  }
`

export const useTransactionsQuery = (variables: () => TransactionsQueryVariables) =>
  useQuery<TransactionsQuery, TransactionsQueryVariables>(TRANSACTIONS_QUERY, variables)
